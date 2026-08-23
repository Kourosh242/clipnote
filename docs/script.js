(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('language-toggle');
  const translatable = [...document.querySelectorAll('[data-fa][data-en]')];

  function setLanguage(language) {
    const isEnglish = language === 'en';
    root.setAttribute('data-language', isEnglish ? 'en' : 'fa');
    root.lang = isEnglish ? 'en' : 'fa';
    root.dir = isEnglish ? 'ltr' : 'rtl';

    translatable.forEach((element) => {
      element.textContent = element.dataset[isEnglish ? 'en' : 'fa'];
    });

    if (toggle) {
      toggle.textContent = isEnglish ? 'فا' : 'EN';
      toggle.setAttribute('aria-label', isEnglish ? 'تغییر زبان به فارسی' : 'Switch language to English');
      toggle.setAttribute('title', isEnglish ? 'فارسی' : 'English');
    }

    try {
      localStorage.setItem('clipnote-wiki-language', isEnglish ? 'en' : 'fa');
    } catch (_) {
      // Private browsing can disable localStorage; the page still works normally.
    }
  }

  let preferredLanguage = 'fa';
  try {
    preferredLanguage = localStorage.getItem('clipnote-wiki-language') || preferredLanguage;
  } catch (_) {
    // Use the Persian-first default.
  }
  setLanguage(preferredLanguage === 'en' ? 'en' : 'fa');

  toggle?.addEventListener('click', () => {
    setLanguage(root.getAttribute('data-language') === 'en' ? 'fa' : 'en');
  });
})();
