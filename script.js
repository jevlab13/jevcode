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
  if (btn.getAttribute('style')) link.setAttribute('style', btn.getAttribute('style'));
  link.dataset.state = 'revealed';
  link.setAttribute('aria-label', label + ': ' + address);
  link.innerHTML = btn.innerHTML;
  btn.replaceWith(link);
});

// ---------------- QR code (jev.lv) ----------------
// Drawn on first open; uses the page's accent colour for the corner marks.

(function () {
  const overlay = document.getElementById('qr-overlay');
  const box = document.getElementById('qr');
  const opener = document.getElementById('qr-open');
  const closer = document.getElementById('qr-close');
  if (!overlay || !opener) return;
  let qr = null;

  function open() {
    overlay.hidden = false;
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff4fc8';
    const opts = {
      width: 520, height: 520, type: 'canvas', data: 'https://jev.lv', margin: 0,
      qrOptions: { errorCorrectionLevel: 'Q' },
      dotsOptions: { type: 'rounded', color: '#0b0c0e' },
      cornersSquareOptions: { type: 'extra-rounded', color: accent },
      cornersDotOptions: { type: 'dot', color: '#0b0c0e' },
      backgroundOptions: { color: '#ecebe8' }
    };
    if (window.QRCodeStyling) {
      if (!qr) { qr = new QRCodeStyling(opts); qr.append(box); } else { qr.update(opts); }
    } else {
      box.textContent = 'https://jev.lv';
    }
    closer.focus();
  }
  function close() { overlay.hidden = true; opener.focus(); }

  opener.addEventListener('click', open);
  const centre = document.getElementById('qr-open-center');
  if (centre) centre.addEventListener('click', open);
  closer.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) close(); });
})();

// ---------------- orbit: sectioned circle ----------------
// Each link group (Professional, Private, Sports, Contact) gets its own arc,
// sized by how many links it holds; links sit evenly inside their arc,
// and the group name runs along the inside of the arc.
(function () {
  const wrap = document.querySelector('.link-groups');
  if (!wrap) return;
  const groups = [...wrap.querySelectorAll('.link-group')];
  const total = groups.reduce((n, g) => n + g.querySelectorAll('.link-item').length, 0);
  const GAP = 10;                                   // degrees between arcs
  const per = (360 - GAP * groups.length) / total;  // degrees per link
  const R = 220, C = 280, LR = 132;                 // ring radius, svg centre, label radius
  const NS = 'http://www.w3.org/2000/svg';
  const pt = (r, a) => [C + r * Math.cos(a * Math.PI / 180), C + r * Math.sin(a * Math.PI / 180)];
  const arc = (r, a0, a1, rev) => {
    const [x0, y0] = pt(r, rev ? a1 : a0), [x1, y1] = pt(r, rev ? a0 : a1);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} ${rev ? 0 : 1} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'orbit-ring');
  svg.setAttribute('viewBox', '0 0 560 560');
  svg.setAttribute('aria-hidden', 'true');

  let start = -90 - (per * groups[0].querySelectorAll('.link-item').length) / 2 - GAP / 2; // first group centred at top
  groups.forEach((g, gi) => {
    const items = [...g.querySelectorAll('.link-item')];
    const span = per * items.length;
    const a0 = start + GAP / 2, a1 = a0 + span;
    items.forEach((el, k) => {
      el.dataset.g = gi;
      el.style.setProperty('--a', (a0 + per * (k + 0.5)) + 'deg');
    });

    const p = document.createElementNS(NS, 'path');
    p.setAttribute('class', 'arc'); p.setAttribute('d', arc(R, a0 + 1, a1 - 1)); p.dataset.g = gi;
    svg.appendChild(p);

    const mid = ((a0 + a1) / 2 + 360) % 360;
    const bottom = mid > 0 && mid < 180;             // keep text upright on the lower half
    const tp = document.createElementNS(NS, 'path');
    tp.setAttribute('id', 'orbit-lbl-' + gi); tp.setAttribute('fill', 'none');
    tp.setAttribute('d', arc(bottom ? LR + 8 : LR, a0, a1, bottom));
    svg.appendChild(tp);
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('class', 'lbl'); t.dataset.g = gi;
    const tpath = document.createElementNS(NS, 'textPath');
    tpath.setAttribute('href', '#orbit-lbl-' + gi);
    tpath.setAttribute('startOffset', '50%'); tpath.setAttribute('text-anchor', 'middle');
    t.appendChild(tpath); svg.appendChild(t);

    start = a1 + GAP / 2;
  });
  wrap.prepend(svg);

  function labels() {
    groups.forEach((g, gi) => {
      const tp = svg.querySelector(`text[data-g="${gi}"] textPath`);
      const title = g.querySelector('.link-group__title');
      if (tp && title) tp.textContent = title.textContent;
    });
  }
  labels();
  document.querySelectorAll('.lang-btn').forEach((b) => b.addEventListener('click', () => setTimeout(labels, 0)));
})();

// ---------------- design switch ----------------
// Two stylesheets on the page; only one is enabled. Choice is remembered per visitor.
(function () {
  const orbit = document.getElementById('css-orbit');
  const classic = document.getElementById('css-classic');
  const btns = document.querySelectorAll('.design-btn');
  if (!orbit || !classic) return;
  function apply(d, save) {
    orbit.disabled = d === 'classic';
    classic.disabled = d !== 'classic';
    btns.forEach((b) => b.classList.toggle('active', b.dataset.design === d));
    if (save) { try { localStorage.setItem('jev-design', d); } catch (e) {} }
  }
  btns.forEach((b) => b.addEventListener('click', () => apply(b.dataset.design, true)));
  apply(classic.disabled ? 'orbit' : 'classic', false);
})();
