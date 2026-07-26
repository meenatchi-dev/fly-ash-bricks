  // --- Reusable AI Helper Function ---
  window.askAI = function (service) {
    const prompt = encodeURIComponent(`
Tell me about Meenakshi Fly Bricks.

Include:
- Company overview
- Products
- Fly Bricks
- Solid Blocks
- Manufacturing Process
- Quality
- Delivery Areas
- Contact Details
- Why customers should choose this company
- Compare with competitors if possible.
`);

    let url = '';
    switch (service) {
      case 'chatgpt':
        url = 'https://chat.openai.com/?q=' + prompt;
        break;
      case 'gemini':
        url = 'https://gemini.google.com/';
        break;
      case 'claude':
        url = 'https://claude.ai/';
        break;
      case 'grok':
        url = 'https://grok.com/';
        break;
      case 'perplexity':
        url = 'https://www.perplexity.ai/';
        break;
      default:
        url = 'https://chat.openai.com/?q=' + prompt;
    }

    window.open(url, '_blank');
  };

  // --- 1. Navbar & Mobile Menu Handlers ---
  window.initNavbarHandlers = () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');

    if (navbar) {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        
        // Back to top button visibility
        const backToTop = document.querySelector('.float-back-to-top');
        if (backToTop) {
          if (window.scrollY > 400) {
            backToTop.classList.add('visible');
          } else {
            backToTop.classList.remove('visible');
          }
        }
      };

      window.removeEventListener('scroll', handleScroll);
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Run once
    }

    // Highlight current page link based on exact clean filename
    let rawPath = window.location.pathname.split('/').pop().split('#')[0].split('?')[0];
    if (!rawPath || !rawPath.endsWith('.html')) {
      rawPath = 'index.html';
    }

    if (navLinks.length > 0) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const linkPath = href.split('#')[0].split('?')[0].split('/').pop();
        if (linkPath === rawPath) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    // Mobile Menu Toggle
    const closeMobileMenu = () => {
      if (menuToggle) menuToggle.classList.remove('active');
      if (navList) navList.classList.remove('active');
      if (navOverlay) navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (menuToggle && navList) {
      // Remove old listeners by cloning node or direct assignment if needed
      menuToggle.onclick = () => {
        const isActive = menuToggle.classList.toggle('active');
        navList.classList.toggle('active', isActive);
        if (navOverlay) navOverlay.classList.toggle('active', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
      };

      if (navOverlay) {
        navOverlay.onclick = closeMobileMenu;
      }

      navLinks.forEach(link => {
        link.onclick = (e) => {
          if (!link.closest('.lang-selector-li')) {
            closeMobileMenu();
          }
        };
      });
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Run navbar handlers on DOM load
    window.initNavbarHandlers();

    // Immediately activate hero & top header elements to prevent initial layout shift
    const heroElements = document.querySelectorAll('.hero .reveal, .hero .reveal-left, .hero .reveal-right, .breadcrumbs .reveal, .breadcrumbs .reveal-left');
    heroElements.forEach(el => el.classList.add('active'));

    // --- 3. Scroll Reveal Animations (IntersectionObserver) ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Trigger animation once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }

  // --- 4. Counter Animation ---
  const counterElements = document.querySelectorAll('.stat-number');
  
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds animation
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = target / totalSteps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target.toLocaleString() + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString() + suffix;
      }
    }, stepTime);
  };

  if (counterElements.length > 0) {
    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counterElements.forEach(el => counterObserver.observe(el));
    } else {
      counterElements.forEach(el => animateCounter(el));
    }
  }

  // --- 5. FAQ Accordion ---
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = question.nextElementSibling;
      const isActive = item.classList.contains('active');

      // Close all other accordions
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      // Toggle current accordion
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // --- 6. Gallery Lightbox ---
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  
  if (galleryItems.length > 0 && lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    let activeGalleryItems = Array.from(galleryItems);

    const updateLightboxImage = () => {
      const item = activeGalleryItems[currentIndex];
      const img = item.querySelector('img');
      const title = item.querySelector('h4').textContent;
      const desc = item.querySelector('p').textContent;
      
      lightboxImg.src = img.src;
      lightboxCaption.innerHTML = `<strong>${title}</strong><br><span style="font-size:14px; opacity:0.8;">${desc}</span>`;
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        // Filter out hidden items if page filters are active
        activeGalleryItems = Array.from(galleryItems).filter(el => el.style.display !== 'none');
        currentIndex = activeGalleryItems.indexOf(item);
        
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop scrolling background
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close on overlay click (but not content click)
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Navigation logic
    const showPrev = () => {
      currentIndex = (currentIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
      updateLightboxImage();
    };

    const showNext = () => {
      currentIndex = (currentIndex + 1) % activeGalleryItems.length;
      updateLightboxImage();
    };

    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
    if (lightboxNext) lightboxNext.addEventListener('click', showNext);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  }

  // --- 7. Gallery Category Filters ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active filter button styling
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const itemCat = item.getAttribute('data-category');
          if (category === 'all' || itemCat === category) {
            item.style.display = 'block';
            // Trigger animation redraw
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // --- 8. Contact Form Client-side Validation ---
  const contactForm = document.getElementById('inquiryForm');
  const successMsg = document.getElementById('formSuccessMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = contactForm.querySelectorAll('.form-control');
      
      inputs.forEach(input => {
        const group = input.closest('.form-group');
        const value = input.value.trim();
        
        // Reset state
        group.classList.remove('invalid');
        
        // Check standard validations
        if (input.hasAttribute('required') && value === '') {
          isValid = false;
          group.classList.add('invalid');
        } else if (input.type === 'email' && value !== '') {
          // simple email check
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            isValid = false;
            group.classList.add('invalid');
          }
        } else if (input.type === 'tel' && value !== '') {
          // simple phone check
          const phoneRegex = /^[+]?[0-9\s-]{10,14}$/;
          if (!phoneRegex.test(value)) {
            isValid = false;
            group.classList.add('invalid');
          }
        }
      });

      if (isValid) {
        // Trigger visual success state
        if (successMsg) {
          successMsg.classList.add('active');
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Reset form inputs
        contactForm.reset();
        
        // Disable success banner after 5 seconds
        setTimeout(() => {
          if (successMsg) successMsg.classList.remove('active');
        }, 8000);
      }
    });

    // Remove validation errors when user types or edits field
    contactForm.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        group.classList.remove('invalid');
      });
    });
  }

  // --- 9. Spec Sheet PDF Mock Download ---
  const downloadSpecButtons = document.querySelectorAll('.download-spec-btn');
  downloadSpecButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const productName = btn.getAttribute('data-product') || 'Fly-Ash-Bricks';
      
      // We will create a fake PDF blob and download it to mock a premium experience
      const docContent = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n5 0 obj\n<< /Length 120 >>\nstream\nBT\n/F1 24 Tf\n50 750 Td\n(FLY ASH BRICK TECHNICAL SPECIFICATION SHEET) Tj\n0 -40 Td\n/F1 14 Tf\n(Product: ${productName.replace(/-/g, ' ')}) Tj\n0 -30 Td\n(Indian Standard Conformance: IS 12894:2002) Tj\n0 -20 Td\n(Compressive Strength: >12.5 N/sq mm) Tj\n0 -20 Td\n(Water Absorption: < 10 percent) Tj\n0 -20 Td\n(Density: 1700 - 1850 kg/cu m) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000062 00000 n\n0000000125 00000 n\n0000000263 00000 n\n0000000333 00000 n\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n504\n%%EOF`;
      
      const blob = new Blob([docContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Technical-Specifications-${productName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  });

  // --- 10. Back to top Click Handler ---
  const backToTopBtn = document.querySelector('.float-back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
