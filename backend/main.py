from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import aiosmtplib
from email.message import EmailMessage
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587

EMAIL = os.getenv("EMAIL")
PASSWORD = os.getenv("PASSWORD")


class Contact(BaseModel):
    name: str
    email: str
    phone: str
    message: str


async def send_mail(to_email, subject, body):

    msg = EmailMessage()

    msg["From"] = EMAIL
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.set_content(body)

    await aiosmtplib.send(
        msg,
        hostname=SMTP_HOST,
        port=SMTP_PORT,
        start_tls=True,
        username=EMAIL,
        password=PASSWORD,
    )


@app.post("/contact")
async def contact(data: Contact):

    admin_body = f"""
Name: {data.name}

Email: {data.email}

Phone: {data.phone}

Message:

{data.message}
"""

    await send_mail(
        EMAIL,
        "New Contact Form",
        admin_body
    )

    customer_body = f"""
Hi {data.name},

Thank you for contacting Meenakshi Fly Bricks.

We have received your enquiry.

Our team will contact you shortly.

Regards,
Meenakshi Fly Bricks
"""

    await send_mail(
        data.email,
        "Thank You",
        customer_body
    )

    return {
        "status": "success"
    }