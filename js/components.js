(function () {
  'use strict';

  // --- Dynamic Header & Footer Component Loader ---
  async function loadComponents() {
    const headerEl = document.querySelector('header.navbar[data-component="header"], header[data-component="header"]');
    const footerEl = document.querySelector('footer.footer[data-component="footer"], footer[data-component="footer"]');

    let loaded = false;

    if (headerEl && (!headerEl.children.length || headerEl.hasAttribute('data-component'))) {
      try {
        const response = await fetch('components/header.html');
        if (response.ok) {
          headerEl.innerHTML = await response.text();
          loaded = true;
        }
      } catch (err) {
        console.warn('[components] Header component fetch failed:', err);
      }
    }

    if (footerEl && (!footerEl.children.length || footerEl.hasAttribute('data-component'))) {
      try {
        const response = await fetch('components/footer.html');
        if (response.ok) {
          footerEl.innerHTML = await response.text();
          loaded = true;
        }
      } catch (err) {
        console.warn('[components] Footer component fetch failed:', err);
      }
    }

    if (loaded) {
      if (typeof window.initNavbarHandlers === 'function') {
        window.initNavbarHandlers();
      }
      if (window.i18n && typeof window.i18n.setLanguage === 'function') {
        window.i18n.setLanguage(window.i18n.getCurrentLang());
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
  } else {
    loadComponents();
  }
})();
