// ---- footer year ----
document.getElementById('year').textContent = new Date().getFullYear();

// ---- scroll-reveal for chapters ----
const chapters = document.querySelectorAll('.chapter');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  chapters.forEach((c) => io.observe(c));
} else {
  chapters.forEach((c) => c.classList.add('in'));
}

// ---- hero trace-line: draw once on load ----
const trace = document.getElementById('traceline');
if (trace) {
  const path = trace.querySelector('path');
  if (path && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    path.getBoundingClientRect(); // force reflow
    path.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.65,0,.35,1) .3s';
    requestAnimationFrame(() => { path.style.strokeDashoffset = '0'; });
  }
}

// ---- email obfuscation: assembled only on click, never present as plain text/markup ----
document.querySelectorAll('.email-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.dataset.state === 'revealed') return;
    const user = btn.dataset.user;
    const domain = btn.dataset.domain;
    const address = user + '@' + domain; // built at click time only
    const label = btn.dataset.label || 'Email';

    btn.dataset.state = 'revealed';
    btn.textContent = address;
    btn.setAttribute('aria-label', label + ': ' + address);

    // turn the button into a real mailto link after reveal
    const link = document.createElement('a');
    link.href = 'mailto:' + address;
    link.className = btn.className;
    link.textContent = address;
    link.setAttribute('aria-label', label + ': ' + address);
    btn.replaceWith(link);
  });
});
