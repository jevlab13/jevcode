// ============================================================
// script.js — routing, i18n, hero animation, email reveal
// ============================================================

const LANGS = ["en", "ru", "lv", "de"];
const DEFAULT_LANG = "en";
const VIEWS = ["home", "professional", "private", "sports", "contacts"];

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

// ---------------- routing ----------------

function currentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return VIEWS.includes(hash) ? hash : 'home';
}

function showView(name) {
  VIEWS.forEach((v) => {
    const el = document.getElementById('view-' + v);
    if (!el) return;
    if (v === name) {
      el.hidden = false;
      // restart the CSS entrance animation
      el.style.animation = 'none';
      // eslint-disable-next-line no-unused-expressions
      el.offsetHeight;
      el.style.animation = '';
    } else {
      el.hidden = true;
    }
  });

  window.scrollTo({ top: 0, behavior: 'instant' in document.documentElement.style ? 'instant' : 'auto' });

  const titles = {
    home: 'Jev Popovs',
    professional: 'Professional — Jev Popovs',
    private: 'Private — Jev Popovs',
    sports: 'Sports — Jev Popovs',
    contacts: 'Contacts — Jev Popovs'
  };
  document.title = titles[name] || 'Jev Popovs';

  if (name === 'home') runHeroTrace();
}

window.addEventListener('hashchange', () => showView(currentRoute()));
showView(currentRoute());

// ---------------- hero trace-line animation ----------------

function runHeroTrace() {
  const trace = document.getElementById('traceline');
  if (!trace) return;
  const path = trace.querySelector('path');
  if (!path) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const len = path.getTotalLength();
  path.style.transition = 'none';
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = len;
  path.getBoundingClientRect(); // force reflow
  path.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.65,0,.35,1) .3s';
  requestAnimationFrame(() => { path.style.strokeDashoffset = '0'; });
}

// ---------------- email obfuscation ----------------
// Built at click time only — never present as plain text/markup in the HTML,
// so static scrapers reading the raw page source can't harvest it.

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.email-btn[data-user]');
  if (!btn || btn.dataset.state === 'revealed') return;

  const user = btn.dataset.user;
  const domain = btn.dataset.domain;
  const address = user + '@' + domain;
  const label = btn.dataset.label || 'Email';

  btn.dataset.state = 'revealed';
  btn.textContent = address;
  btn.setAttribute('aria-label', label + ': ' + address);

  const link = document.createElement('a');
  link.href = 'mailto:' + address;
  link.className = btn.className;
  link.textContent = address;
  link.setAttribute('aria-label', label + ': ' + address);
  btn.replaceWith(link);
});
