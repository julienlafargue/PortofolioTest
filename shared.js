/* ══════════════════════════════════════════
   SHARED.JS  —  Tia-Lana Chinapyel
   Language · Show/Hide Router · Animations
══════════════════════════════════════════ */

/* ── HTML-content translations ── */
const HTML_TRANSLATIONS = {
  en: {
    'about.title':      'A creative with a <em>story to tell</em>',
    'skills.title':     'What I<br><em>create</em>',
    'exp.title':        'My<br><em>Experience</em>',
    'explore.title':    'My two <em>worlds</em>',
    'contact.title':    "Let's create<br>something <em>beautiful</em>",
    'explore.acting':   'Acting &amp;<br><em>Performance</em>',
    'explore.photo':    'Photography &amp;<br><em>Gallery</em>',
    'acting.skills':    'Skills &amp; <em>Abilities</em>',
    'acting.credits':   'Stage &amp; <em>Screen</em>',
    'acting.training':  'My <em>Training</em>',
    'acting.contact':   "Let's create<br>something <em>memorable</em>",
    'photo.hero':       'My<br><em>Photography</em>',
    'photo.contact':    "Let's create<br>something <em>beautiful</em>",
  },
  fr: {
    'about.title':      'Une créative avec une <em>histoire à raconter</em>',
    'skills.title':     'Ce que je<br><em>crée</em>',
    'exp.title':        'Mon<br><em>Expérience</em>',
    'explore.title':    'Mes deux <em>univers</em>',
    'contact.title':    "Créons quelque chose<br>de <em>beau</em>",
    'explore.acting':   "Jeu d'actrice &amp;<br><em>Performance</em>",
    'explore.photo':    'Photographie &amp;<br><em>Galerie</em>',
    'acting.skills':    'Compétences &amp; <em>Aptitudes</em>',
    'acting.credits':   'Scène &amp; <em>Écran</em>',
    'acting.training':  'Ma <em>Formation</em>',
    'acting.contact':   "Créons quelque chose<br>de <em>mémorable</em>",
    'photo.hero':       'Ma<br><em>Photographie</em>',
    'photo.contact':    "Créons quelque chose<br>de <em>beau</em>",
  }
};

/* ── Language system ── */
let currentLang = localStorage.getItem('tl-lang') || 'en';

function applyLang(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-en]').forEach(el => {
    el.textContent = lang === 'fr' ? (el.dataset.fr || el.dataset.en) : el.dataset.en;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    const dict = HTML_TRANSLATIONS[lang] || HTML_TRANSLATIONS.en;
    if (dict[key]) el.innerHTML = dict[key];
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('tl-lang', lang);
  applyLang(lang);
}

/* ── Scroll Animations (IntersectionObserver) ── */
let scrollObs = null;
let counterObs = null;

function buildObservers() {
  if (scrollObs) scrollObs.disconnect();
  if (counterObs) counterObs.disconnect();

  scrollObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      e.target.classList.toggle('visible', e.isIntersecting);
    });
  }, { threshold: .07, rootMargin: '0px 0px -60px 0px' });

  counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: .6 });
}

function initScrollAnimations() {
  buildObservers();
  document.querySelectorAll('.fade-up, .slide-left, .slide-right, .scale-in, .draw-line')
    .forEach(el => scrollObs.observe(el));
  document.querySelectorAll('.stagger').forEach(parent => {
    [...parent.children].forEach((child, i) => {
      child.style.transitionDelay = `${i * 90}ms`;
    });
  });
}

function initCounters() {
  document.querySelectorAll('.stat h4, .hero-stat h4').forEach(el => counterObs.observe(el));
}

/* ── Counter animation ── */
function animateCounter(el) {
  const raw = el.textContent.trim();
  const num = parseFloat(raw);
  if (isNaN(num) || num === 0) return;
  const suffix   = raw.replace(/^[\d.]+/, '');
  const duration = 1400;
  let t0 = null;
  const step = ts => {
    if (!t0) t0 = ts;
    const p = Math.min((ts - t0) / duration, 1);
    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * num) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ── Persistent scroll handler (parallax + progress bar) ── */
let scrollTick = false;
window.addEventListener('scroll', () => {
  if (!scrollTick) {
    requestAnimationFrame(() => {
      const y = window.scrollY;
      document.querySelectorAll('.hero-right img, .page-hero-right img').forEach(img => {
        img.style.transform = `scale(1.07) translateY(${y * 0.1}px)`;
      });
      const bar = document.getElementById('scroll-progress');
      if (bar) {
        const d = document.documentElement;
        bar.style.transform = `scaleX(${y / (d.scrollHeight - d.clientHeight)})`;
      }
      scrollTick = false;
    });
    scrollTick = true;
  }
}, { passive: true });

/* ── Hero lines entrance ── */
function initHeroLines() {
  const activePage = document.getElementById('page-' + currentPage);
  if (!activePage) return;
  const lines = activePage.querySelectorAll('.hero-line');
  lines.forEach(el => el.classList.remove('visible'));
  setTimeout(() => lines.forEach(el => el.classList.add('visible')), 350);
}

/* ── Cursor glow ── */
function initCursorGlow() {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  if (document.getElementById('cursor-dot')) return;

  const dot = Object.assign(document.createElement('div'), { id: 'cursor-dot' });
  dot.style.cssText = 'position:fixed;pointer-events:none;z-index:9998;width:6px;height:6px;border-radius:50%;background:var(--rose);opacity:0;transform:translate(-50%,-50%);transition:opacity .3s;mix-blend-mode:multiply';

  const ring = Object.assign(document.createElement('div'), { id: 'cursor-ring' });
  ring.style.cssText = 'position:fixed;pointer-events:none;z-index:9997;width:28px;height:28px;border-radius:50%;border:1px solid rgba(201,115,106,.35);opacity:0;transform:translate(-50%,-50%);transition:opacity .3s,width .3s,height .3s,border-color .3s';

  document.body.append(dot, ring);

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.opacity = ring.style.opacity = '1';
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = ring.style.opacity = '0';
  });
  (function anim() {
    rx += (mx - rx) * .12; ry += (my - ry) * .12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(anim);
  })();

  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button')) {
      ring.style.width = ring.style.height = '46px';
      ring.style.borderColor = 'rgba(201,115,106,.7)';
    } else {
      ring.style.width = ring.style.height = '28px';
      ring.style.borderColor = 'rgba(201,115,106,.35)';
    }
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
  menu.addEventListener('click', e => { if (e.target === menu) closeMenu(); });
}

/* ── Nav active state ── */
const PAGE_MAP = {
  'index.html': 'home',
  'acting.html': 'acting',
  'photography.html': 'photography',
};

function updateNavActive(pageId) {
  document.querySelectorAll('.nav-links a, .mobile-menu a.ml').forEach(link => {
    const href = link.getAttribute('href') || '';
    const [filePart, anchorPart] = href.split('#');
    const fileName = (filePart.split('/').pop()) || 'index.html';
    const linkPage = PAGE_MAP[fileName] || 'home';
    /* Section-anchor links (about, contact) never get the active class —
       only top-level page links (acting, photography) do */
    const isSectionLink = linkPage === 'home' && !!anchorPart;
    link.classList.toggle('active', !isSectionLink && linkPage === pageId && pageId !== 'home');
  });
}

/* ══════════════════════════════════════════
   SHOW/HIDE ROUTER — one HTML file,
   no fetch, no reload, truly fixed nav
══════════════════════════════════════════ */
let currentPage = 'home';

function showPage(pageId, pushState = true) {
  const nextEl = document.getElementById('page-' + pageId);
  if (!nextEl) return;

  const currentEl = document.getElementById('page-' + currentPage);

  /* Fade out current page */
  if (currentEl && currentEl !== nextEl) {
    currentEl.style.transition = 'opacity 0.25s ease';
    currentEl.style.opacity = '0';
  }

  setTimeout(() => {
    /* Hide all pages */
    document.querySelectorAll('.site-page').forEach(p => {
      p.style.display = 'none';
      p.classList.remove('active');
    });

    /* Show new page */
    nextEl.style.display = 'block';
    nextEl.style.opacity = '0';
    nextEl.style.transition = 'none';
    nextEl.classList.add('active');

    currentPage = pageId;

    window.scrollTo(0, 0);

    updateNavActive(pageId);

    /* Close mobile menu */
    document.getElementById('hamburger')?.classList.remove('open');
    document.getElementById('mobileMenu')?.classList.remove('open');
    document.body.style.overflow = '';

    /* Push state — use hash-based URLs so GitHub Pages never reloads */
    if (pushState) {
      const url = pageId === 'home' ? 'index.html' : 'index.html#' + pageId;
      history.pushState({ page: pageId }, '', url);
    }

    /* Re-init shared behaviour */
    initScrollAnimations();
    initCounters();
    initHeroLines();
    applyLang(currentLang);

    /* Photography-specific init */
    if (pageId === 'photography' && typeof initPhotographyPage === 'function') {
      initPhotographyPage();
    }

    /* Fade in new page */
    requestAnimationFrame(() => requestAnimationFrame(() => {
      nextEl.style.transition = 'opacity 0.45s ease';
      nextEl.style.opacity = '1';
    }));

  }, currentEl ? 250 : 0);
}

/* ── Router init ── */
function initRouter() {
  /* Determine initial page from URL */
  const hash = location.hash.slice(1);
  const file = location.pathname.split('/').pop() || 'index.html';

  /* Handle hash redirects from stub pages (acting.html → index.html#acting) */
  if (hash === 'acting' || hash === 'photography') {
    currentPage = hash;
    /* Keep URL on index.html with a hash so local file reloads don't try to
       navigate to a separate stub page (which may not exist locally).
       Use same pattern as `showPage` pushState. */
    history.replaceState({ page: hash }, '', 'index.html#' + hash);
  } else {
    currentPage = PAGE_MAP[file] || 'home';
  }

  /* Hide non-active pages */
  document.querySelectorAll('.site-page').forEach(p => {
    const pid = p.id.replace('page-', '');
    if (pid !== currentPage) {
      p.style.display = 'none';
      p.classList.remove('active');
    } else {
      p.style.display = 'block';
      p.classList.add('active');
    }
  });

  updateNavActive(currentPage);

  /* Initial page reveal */
  const overlay = document.getElementById('page-transition');
  if (overlay) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      overlay.classList.add('pt-hidden');
      const activePage = document.getElementById('page-' + currentPage);
      if (activePage) {
        activePage.style.opacity = '0';
        setTimeout(() => {
          activePage.style.transition = 'opacity 0.5s ease';
          activePage.style.opacity = '1';
        }, 200);
      }
    }));
  }

  /* Record initial history entry */
  history.replaceState({ page: currentPage }, '', location.href);

  /* Intercept ALL internal link clicks via delegation */
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href
      || href.startsWith('mailto:')
      || href.startsWith('tel:')
      || href.includes('://')
    ) return;

    /* Pure hash → scroll within current page */
    if (href.startsWith('#')) {
      const target = document.getElementById(href.slice(1));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
      return;
    }

    const [filePart, anchorPart] = href.split('#');
    const fileName = (filePart.split('/').pop()) || 'index.html';
    const targetPage = PAGE_MAP[fileName] || 'home';

    e.preventDefault();

    if (targetPage === currentPage) {
      if (anchorPart) {
        document.getElementById(anchorPart)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    showPage(targetPage);

    if (anchorPart) {
      setTimeout(() => document.getElementById(anchorPart)?.scrollIntoView({ behavior: 'smooth' }), 650);
    }
  });

  /* Browser back / forward */
  window.addEventListener('popstate', e => {
    const page = e.state?.page || PAGE_MAP[location.pathname.split('/').pop()] || 'home';
    showPage(page, false);
  });

  /* Photography init if starting on that page */
  if (currentPage === 'photography' && typeof initPhotographyPage === 'function') {
    initPhotographyPage();
  }
}

/* ── DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', () => {
  applyLang(currentLang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  initHamburger();
  buildObservers();
  initScrollAnimations();
  initCounters();
  initHeroLines();
  initCursorGlow();
  initRouter();
  updateNavActive(currentPage);
});
