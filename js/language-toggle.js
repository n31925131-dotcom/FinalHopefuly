// Language Toggle System

const LANGUAGES = ['en', 'el'];
const DEFAULT_LANGUAGE = 'el'; // Default to Greek as per business location

class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem('language') || DEFAULT_LANGUAGE;
    this.translations = {};
    this.init();
  }

  async init() {
    // Load translations
    await Promise.all(LANGUAGES.map(lang => this.loadLanguage(lang)));
    
    // Apply current language
    this.applyLanguage(this.currentLang);
    
    // Setup toggle buttons
    this.setupEventListeners();
  }

  async loadLanguage(lang) {
    try {
      const response = await fetch(`lang/${lang}.json`);
      this.translations[lang] = await response.json();
    } catch (error) {
      console.error(`Failed to load language: ${lang}`, error);
    }
  }

  applyLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;

    // Update all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.getNestedValue(this.translations[lang], key);
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else if (el.tagName === 'IMG') {
          el.alt = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Update active state of language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      if (btn.dataset.lang === lang) {
        btn.classList.add('font-bold', 'text-rose-600');
        btn.classList.remove('text-gray-500');
      } else {
        btn.classList.remove('font-bold', 'text-rose-600');
        btn.classList.add('text-gray-500');
      }
    });

    // Dispatch event for other scripts
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  }

  getNestedValue(obj, key) {
    return key.split('.').reduce((o, k) => (o || {})[k], obj);
  }

  setupEventListeners() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = e.target.closest('.lang-btn').dataset.lang;
        this.applyLanguage(lang);
      });
    });
  }
}

// Initialize on page load
const languageManager = new LanguageManager();
