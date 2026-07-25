(function () {
  'use strict';

  const SUPPORTED_LANGS = ['en', 'ta', 'hi', 'te', 'kn'];
  const DEFAULT_LANG = 'en';
  const STORAGE_KEY = 'preferred_language';

  let currentLang = DEFAULT_LANG;
  const translationsCache = {};

  // Helper to fetch JSON file safely
  async function fetchTranslation(lang) {
    if (translationsCache[lang]) {
      return translationsCache[lang];
    }
    try {
      const response = await fetch(`locales/${lang}.json`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      translationsCache[lang] = data;
      return data;
    } catch (err) {
      console.warn(`[i18n] Failed to load locale "${lang}", falling back to English.`, err);
      return null;
    }
  }

  // Get nested value from object using dot notation (e.g. 'hero.title')
  function getNestedValue(obj, keyPath) {
    if (!obj || !keyPath) return null;
    const keys = keyPath.split('.');
    let current = obj;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return null;
      }
    }
    return typeof current === 'string' ? current : null;
  }

  // Get translation with fallback to English
  function t(key) {
    const langData = translationsCache[currentLang];
    const enData = translationsCache[DEFAULT_LANG];

    let val = getNestedValue(langData, key);
    if (val === null && currentLang !== DEFAULT_LANG) {
      val = getNestedValue(enData, key);
    }
    return val !== null ? val : key;
  }

  // Apply translations to the DOM
  function applyTranslations() {
    // 1. Update text/html elements
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = t(key);
      if (translation !== key || currentLang === DEFAULT_LANG) {
        if (el.getAttribute('data-i18n-mode') === 'html') {
          el.innerHTML = translation;
        } else {
          el.textContent = translation;
        }
      }
    });

    // 2. Update placeholder attributes if any
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = t(key);
      if (translation) {
        el.setAttribute('placeholder', translation);
      }
    });

    // 3. Update document language tag
    document.documentElement.lang = currentLang;

    // 4. Update dropdown element if present
    const langSelects = document.querySelectorAll('.lang-select');
    langSelects.forEach(select => {
      if (select.value !== currentLang) {
        select.value = currentLang;
      }
    });
  }

  // Set language and update UI
  async function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) {
      lang = DEFAULT_LANG;
    }

    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    // Ensure English is loaded for fallback if necessary
    if (!translationsCache[DEFAULT_LANG]) {
      await fetchTranslation(DEFAULT_LANG);
    }

    // Load target language
    if (lang !== DEFAULT_LANG && !translationsCache[lang]) {
      await fetchTranslation(lang);
    }

    applyTranslations();
  }

  // Initialize i18n
  async function initI18n() {
    const savedLang = localStorage.getItem(STORAGE_KEY);
    const initialLang = (savedLang && SUPPORTED_LANGS.includes(savedLang)) ? savedLang : DEFAULT_LANG;

    // Pre-load default language English
    await fetchTranslation(DEFAULT_LANG);

    // If initial language is different, load it
    if (initialLang !== DEFAULT_LANG) {
      await fetchTranslation(initialLang);
    }

    currentLang = initialLang;
    applyTranslations();

    // Bind all language select dropdowns
    document.addEventListener('change', (e) => {
      if (e.target && e.target.classList.contains('lang-select')) {
        setLanguage(e.target.value);
      }
    });
  }

  // Expose i18n object globally if needed
  window.i18n = {
    setLanguage,
    t,
    getCurrentLang: () => currentLang
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
  } else {
    initI18n();
  }
})();
