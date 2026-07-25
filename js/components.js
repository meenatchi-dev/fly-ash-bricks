(function () {
  'use strict';

  // --- Dynamic Header & Footer Component Loader ---
  async function loadComponents() {
    const headerEl = document.querySelector('header.navbar, header[data-component="header"]');
    const footerEl = document.querySelector('footer.footer, footer[data-component="footer"]');

    if (headerEl && (!headerEl.children.length || headerEl.getAttribute('data-loaded') !== 'true')) {
      try {
        const response = await fetch('components/header.html');
        if (response.ok) {
          headerEl.innerHTML = await response.text();
          headerEl.setAttribute('data-loaded', 'true');
        }
      } catch (err) {
        console.warn('[components] Header component fetch fallback active:', err);
      }
    }

    if (footerEl && (!footerEl.children.length || footerEl.getAttribute('data-loaded') !== 'true')) {
      try {
        const response = await fetch('components/footer.html');
        if (response.ok) {
          footerEl.innerHTML = await response.text();
          footerEl.setAttribute('data-loaded', 'true');
        }
      } catch (err) {
        console.warn('[components] Footer component fetch fallback active:', err);
      }
    }

    // Always re-initialize handlers & i18n
    if (typeof window.initNavbarHandlers === 'function') {
      window.initNavbarHandlers();
    }
    if (window.i18n && typeof window.i18n.setLanguage === 'function') {
      window.i18n.setLanguage(window.i18n.getCurrentLang());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
  } else {
    loadComponents();
  }
})();
