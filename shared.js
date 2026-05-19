// ── Scroll fade-in ──
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .08 });
document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

// ── Hamburger ──
const btn  = document.getElementById('hamburger');
const menu = document.getElementById('mobileMenu');

function closeMenu() {
  btn.classList.remove('open');
  menu.classList.remove('open');
  document.body.style.overflow = '';
}

btn.addEventListener('click', () => {
  const open = btn.classList.toggle('open');
  menu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.ml').forEach(l => l.addEventListener('click', closeMenu));
menu.addEventListener('click', e => { if (e.target === menu) closeMenu(); });
