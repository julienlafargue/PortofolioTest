/* ══════════════════════════════════════════
   SHARED.JS  —  Tia-Lana Chinapyel
   Language · SPA Router · Animations
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
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        scrollObs.unobserve(e.target);
      }
    });
  }, { threshold: .07, rootMargin: '0px 0px -40px 0px' });

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
  const suffix   = raw.replace(/[\d.]/g, '');
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
      /* parallax */
      document.querySelectorAll('.hero-right img, .page-hero-right img').forEach(img => {
        img.style.transform = `scale(1.07) translateY(${y * 0.1}px)`;
      });
      /* progress bar */
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
  const lines = document.querySelectorAll('.hero-line');
  setTimeout(() => lines.forEach(el => el.classList.add('visible')), 350);
}

/* ── Cursor glow ── */
function initCursorGlow() {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  if (document.getElementById('cursor-dot')) return; /* already added */

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
function updateNavActive(url) {
  const page = (url.split('#')[0].split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a, .mobile-menu a.ml').forEach(link => {
    const href = (link.getAttribute('href') || '').split('#')[0].split('/').pop() || 'index.html';
    link.classList.toggle('active', href.toLowerCase() === page);
  });
}

/* ══════════════════════════════════════════
   SPA ROUTER — swap only #page-content,
   the nav never reloads
══════════════════════════════════════════ */
const pageCache = new Map();

async function spaNavigate(url, pushState = true) {
  const [pagePart, anchorPart] = url.split('#');

  /* Same-page anchor → just scroll */
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  const targetFile  = (pagePart.split('/').pop() || 'index.html');
  if (!pagePart || targetFile === currentFile) {
    if (anchorPart) {
      document.getElementById(anchorPart)?.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }

  const content = document.getElementById('page-content');

  /* Fade out current content */
  if (content) {
    content.style.transition = 'opacity 0.28s ease';
    content.style.opacity    = '0';
  }

  try {
    /* Fetch & parse target page (browser HTTP cache applies) */
    let doc;
    if (pageCache.has(pagePart)) {
      doc = pageCache.get(pagePart);
    } else {
      const html = await fetch(pagePart).then(r => r.text());
      doc = new DOMParser().parseFromString(html, 'text/html');
      pageCache.set(pagePart, doc);
    }

    /* Wait for fade-out */
    await new Promise(r => setTimeout(r, 300));

    /* Swap page-specific <style> */
    document.querySelector('[data-page-style]')?.remove();
    const headStyle = doc.querySelector('head > style');
    if (headStyle) {
      const s = document.createElement('style');
      s.dataset.pageStyle = '';
      s.textContent = headStyle.textContent;
      document.head.appendChild(s);
    }

    /* Swap #page-content */
    const newContent = doc.getElementById('page-content');
    if (newContent && content) {
      content.replaceWith(newContent.cloneNode(true));
    }

    /* Update <title> */
    if (doc.title) document.title = doc.title;

    /* History */
    if (pushState) history.pushState({ url }, '', url);

    /* Nav active */
    updateNavActive(url);

    /* Close mobile menu if open */
    document.getElementById('hamburger')?.classList.remove('open');
    document.getElementById('mobileMenu')?.classList.remove('open');
    document.body.style.overflow = '';

    /* Scroll */
    window.scrollTo(0, 0);

    /* Re-execute page-specific inline scripts (e.g., lightbox, filters) */
    doc.querySelectorAll('body > script:not([src])').forEach(s => {
      try { (new Function(s.textContent))(); } catch (_) {}
    });

    /* Re-init shared behaviour on new DOM */
    initScrollAnimations();
    initCounters();
    initHeroLines();
    applyLang(currentLang);

    /* Scroll to anchor if any */
    if (anchorPart) {
      setTimeout(() => document.getElementById(anchorPart)?.scrollIntoView({ behavior: 'smooth' }), 120);
    }

    /* Fade in new content */
    const fresh = document.getElementById('page-content');
    if (fresh) {
      fresh.style.opacity    = '0';
      fresh.style.transition = 'none';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        fresh.style.transition = 'opacity 0.45s ease';
        fresh.style.opacity    = '1';
      }));
    }

  } catch (err) {
    /* Fallback: normal navigation */
    window.location.href = url;
  }
}

/* ── Router init ── */
function initRouter() {
  /* Mark the current page's inline <style> so the router can swap it */
  const existingStyle = document.querySelector('head > style');
  if (existingStyle) existingStyle.dataset.pageStyle = '';

  /* Initial page reveal */
  const overlay = document.getElementById('page-transition');
  if (overlay) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      overlay.classList.add('pt-hidden');
      const content = document.getElementById('page-content');
      if (content) setTimeout(() => content.classList.add('content-visible'), 200);
    }));
  }

  /* Record initial history entry */
  history.replaceState({ url: window.location.href }, '', window.location.href);

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

    /* Pure hash link on same page → let browser scroll */
    if (href.startsWith('#')) return;

    e.preventDefault();
    spaNavigate(href);
  });

  /* Browser back / forward */
  window.addEventListener('popstate', e => {
    if (e.state?.url) spaNavigate(e.state.url, false);
  });
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
  updateNavActive(window.location.href);
});
