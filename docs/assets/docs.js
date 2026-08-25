/**
 * docs.js - ClipNote Wiki behaviour: language (fa default / en) and dark mode.
 * No external requests, no analytics. State is kept in localStorage only.
 */
(function () {
  const STORAGE_KEY = 'clipnote_docs_prefs';
  const root = document.documentElement;

  function readPrefs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function writePrefs(prefs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
      /* storage blocked (private mode) - keep session behaviour only */
    }
  }

  function applyLang(lang) {
    const next = lang === 'en' ? 'en' : 'fa';
    root.setAttribute('lang', next);
    root.setAttribute('dir', next === 'fa' ? 'rtl' : 'ltr');
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.langBtn === next));
    });
    const state = readPrefs();
    state.lang = next;
    writePrefs(state);
  }

  function applyDark(dark) {
    const next = !!dark;
    if (next) {
      root.setAttribute('data-dark', 'true');
    } else {
      root.removeAttribute('data-dark');
    }
    document.querySelectorAll('[data-dark-btn]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(next));
    });
    const state = readPrefs();
    state.dark = next;
    writePrefs(state);
  }

  const prefs = readPrefs();
  applyLang(prefs.lang === 'en' ? 'en' : 'fa');
  applyDark(prefs.dark === true);

  document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLang(btn.dataset.langBtn);
    });
  });

  document.querySelectorAll('[data-dark-btn]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyDark(root.getAttribute('data-dark') !== 'true');
    });
  });
})();
