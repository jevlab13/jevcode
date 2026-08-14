// ============================================================
// script.js — language switching, email reveal (one-page site)
// ============================================================

const LANGS = ["en", "ru", "lv", "de"];
const DEFAULT_LANG = "en";

// ---- footer year ----
document.getElementById('year').textContent = new Date().getFullYear();

// ---------------- language ----------------

function detectInitialLang() {
  try {
    const saved = localStorage.getItem('jev-lang');
    if (saved && LANGS.includes(saved)) return saved;
  } catch (e) { /* localStorage unavailable, ignore */ }

  const nav = (navigator.language || '').slice(0, 2).toLowerCase();
  if (LANGS.includes(nav)) return nav;
  return DEFAULT_LANG;
}

function applyTranslations(lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function setLang(lang) {
  if (!LANGS.includes(lang)) lang = DEFAULT_LANG;
  try { localStorage.setItem('jev-lang', lang); } catch (e) { /* ignore */ }
  applyTranslations(lang);
}

document.querySelectorAll('.lang-btn').forEach((btn) => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

setLang(detectInitialLang());

// ---------------- email obfuscation ----------------
// Built at click time only — never present as plain text/markup in the HTML,
// so static scrapers reading the raw page source can't harvest it.

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.link-item[data-user]');
  if (!btn || btn.dataset.state === 'revealed') return;

  const user = btn.dataset.user;
  const domain = btn.dataset.domain;
  const address = user + '@' + domain;
  const label = btn.dataset.label || 'Email';

  btn.dataset.state = 'revealed';
  btn.querySelector('.link-item__label').textContent = address;
  btn.setAttribute('aria-label', label + ': ' + address);

  const link = document.createElement('a');
  link.href = 'mailto:' + address;
  link.className = btn.className;
  link.dataset.state = 'revealed';
  link.setAttribute('aria-label', label + ': ' + address);
  link.innerHTML = btn.innerHTML;
  btn.replaceWith(link);
});
