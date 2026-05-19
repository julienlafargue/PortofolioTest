/* ══════════════════════════════════════════
   SHARED.JS  —  Tia-Lana Chinapyel
   Language · Navigation · Animations · Transitions
══════════════════════════════════════════ */

/* ── HTML-content translations (elements with sub-tags) ── */
const HTML_TRANSLATIONS = {
  en: {
    'about.title':       'A creative with a <em>story to tell</em>',
    'skills.title':      'What I<br><em>create</em>',
    'exp.title':         'My<br><em>Experience</em>',
    'explore.title':     'My two <em>worlds</em>',
    'contact.title':     "Let's create<br>something <em>beautiful</em>",
    'explore.acting':    'Acting &amp;<br><em>Performance</em>',
    'explore.photo':     'Photography &amp;<br><em>Gallery</em>',
    'acting.skills':     'Skills &amp; <em>Abilities</em>',
    'acting.credits':    'Stage &amp; <em>Screen</em>',
    'acting.training':   'My <em>Training</em>',
    'acting.contact':    "Let's create<br>something <em>memorable</em>",
    'photo.hero':        'My<br><em>Photography</em>',
    'photo.contact':     "Let's create<br>something <em>beautiful</em>",
  },
  fr: {
    'about.title':       'Une créative avec une <em>histoire à raconter</em>',
    'skills.title':      'Ce que je<br><em>crée</em>',
    'exp.title':         'Mon<br><em>Expérience</em>',
    'explore.title':     'Mes deux <em>univers</em>',
    'contact.title':     "Créons quelque chose<br>de <em>beau</em>",
    'explore.acting':    "Jeu d'actrice &amp;<br><em>Performance</em>",
    'explore.photo':     'Photographie &amp;<br><em>Galerie</em>',
    'acting.skills':     'Compétences &amp; <em>Aptitudes</em>',
    'acting.credits':    'Scène &amp; <em>Écran</em>',
    'acting.training':   'Ma <em>Formation</em>',
    'acting.contact':    "Créons quelque chose<br>de <em>mémorable</em>",
    'photo.hero':        'Ma<br><em>Photographie</em>',
    'photo.contact':     "Créons quelque chose<br>de <em>beau</em>",
  }
};

/* ── Language system ── */
let currentLang = localStorage.getItem('tl-lang') || 'en';

function applyLang(lang) {
  document.documentElement.lang = lang;

  /* Simple text nodes */
  document.querySelectorAll('[data-en]').forEach(el => {
    const txt = lang === 'fr' ? (el.dataset.fr || el.dataset.en) : el.dataset.en;
    el.textContent = txt;
  });

  /* HTML content nodes */
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    const dict = HTML_TRANSLATIONS[lang] || HTML_TRANSLATIONS.en;
    if (dict[key]) el.innerHTML = dict[key];
  });

  /* Update toggle buttons */
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('tl-lang', lang);
  applyLang(lang);
}

/* ── Scroll Animations ── */
const scrollObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      scrollObs.unobserve(e.target);
    }
  });
}, { threshold: .07, rootMargin: '0px 0px -40px 0px' });

function initScrollAnimations() {
  document.querySelectorAll('.fade-up, .slide-left, .slide-right, .scale-in, .draw-line').forEach(el => {
    scrollObs.observe(el);
  });

  /* Stagger grid children */
  document.querySelectorAll('.stagger').forEach(parent => {
    [...parent.children].forEach((child, i) => {
      child.style.transitionDelay = `${i * 90}ms`;
    });
  });
}

/* ── Counter Animation ── */
function animateCounter(el) {
  const raw  = el.textContent.trim();
  const num  = parseFloat(raw);
  if (isNaN(num) || num === 0) return;
  const suffix   = raw.replace(/[\d.]/g, '');
  const duration = 1400;
  let startTime  = null;

  const step = ts => {
    if (!startTime) startTime = ts;
    const p      = Math.min((ts - startTime) / duration, 1);
    const eased  = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * num) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: .6 });

function initCounters() {
  document.querySelectorAll('.stat h4, .hero-stat h4').forEach(el => {
    counterObs.observe(el);
  });
}

/* ── Parallax Hero ── */
function initParallax() {
  const imgs = document.querySelectorAll('.hero-right img, .page-hero-right img');
  if (!imgs.length) return;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        imgs.forEach(img => {
          img.style.transform = `scale(1.07) translateY(${y * 0.1}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ── Scroll Progress Bar ── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const el  = document.documentElement;
    const pct = el.scrollTop / (el.scrollHeight - el.clientHeight);
    bar.style.transform = `scaleX(${pct})`;
  });
}

/* ── Page Transition ── */
function initPageTransition() {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  /* Reveal: slide overlay up to uncover content */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('pt-hidden');
      const content = document.getElementById('page-content');
      if (content) {
        setTimeout(() => content.classList.add('content-visible'), 200);
      }
    });
  });

  /* Exit: cover with overlay then navigate */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
        href.startsWith('tel:') || href.includes('://')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      const target = href;
      /* Use inline style to avoid class-transition conflicts */
      overlay.style.cssText = [
        'position:fixed', 'inset:0',
        'background:var(--cream)', 'z-index:9000',
        'transform:scaleY(1)', 'transform-origin:bottom',
        'transition:transform .45s cubic-bezier(.76,0,.24,1)',
        'pointer-events:none'
      ].join(';');
      setTimeout(() => { window.location.href = target; }, 500);
    });
  });
}

/* ── Hamburger ── */
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

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
}

/* ── Cursor Glow (subtle artistic touch) ── */
function initCursorGlow() {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  const dot = document.createElement('div');
  dot.id = 'cursor-dot';
  dot.style.cssText = `
    position:fixed;pointer-events:none;z-index:9998;
    width:6px;height:6px;border-radius:50%;
    background:var(--rose);opacity:0;
    transform:translate(-50%,-50%);
    transition:opacity .3s, transform .15s ease;
    mix-blend-mode:multiply;
  `;
  document.body.appendChild(dot);

  const ring = document.createElement('div');
  ring.id = 'cursor-ring';
  ring.style.cssText = `
    position:fixed;pointer-events:none;z-index:9997;
    width:28px;height:28px;border-radius:50%;
    border:1px solid rgba(201,115,106,.35);opacity:0;
    transform:translate(-50%,-50%);
    transition:opacity .3s, transform .35s ease, width .3s, height .3s;
  `;
  document.body.appendChild(ring);

  let mx=0, my=0, rx=0, ry=0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
    dot.style.left  = mx+'px'; dot.style.top  = my+'px';
  });

  function animRing() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = ring.style.opacity = '0';
  });

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = ring.style.height = '48px';
      ring.style.borderColor = 'rgba(201,115,106,.7)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = ring.style.height = '28px';
      ring.style.borderColor = 'rgba(201,115,106,.35)';
    });
  });
}

/* ── Hero line-by-line entrance ── */
function initHeroLines() {
  const lines = document.querySelectorAll('.hero-line');
  /* Stagger in after page reveal starts */
  setTimeout(() => {
    lines.forEach(el => el.classList.add('visible'));
  }, 350);
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  applyLang(currentLang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  initHamburger();
  initScrollAnimations();
  initCounters();
  initParallax();
  initScrollProgress();
  initPageTransition();
  initCursorGlow();
  initHeroLines();
});
