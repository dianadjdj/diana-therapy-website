/* ============================================================
   Diana Chu Therapy — main.js
   GSAP + ScrollTrigger + Lenis smooth scroll
   Celeres-inspired: word reveals, parallax, counters
   ============================================================ */

/* ── Reduced motion preference ── */
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── GSAP custom ease (matches Celeres "outCustom") ── */
if (typeof CustomEase !== 'undefined') {
  CustomEase.create('outCustom', '0.16, 1, 0.3, 1');
}
const EASE_OUT  = typeof CustomEase !== 'undefined' ? 'outCustom' : 'power3.out';
const EASE_IN   = 'power3.in';

/* ── Register ScrollTrigger ── */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Mark document as JS-ready so CSS can safely hide pre-animation elements
  document.documentElement.classList.add('js-ready');

  initLenis();
  initNav();
  setActiveNavLink();
  initHeroReveal();
  initScrollReveal();
  initParallax();
  initCounters();
  initFAQ();
  initForm();
  initMobileNav();
  initExitIntent();
  initNewsletterForm();
});

/* ── LENIS smooth scrolling ── */
function initLenis() {
  if (typeof Lenis === 'undefined' || typeof gsap === 'undefined') return;

  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1.0, smoothTouch: false });

  // Feed scroll position to ScrollTrigger
  lenis.on('scroll', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
  });

  // Drive Lenis with GSAP's ticker — eliminates competing RAF loops
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  window._lenis = lenis;
}

/* ── NAVIGATION ── */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  // If the page starts with .scrolled (all pages now), keep it permanently solid.
  // No dynamic toggling needed.
}

function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function initMobileNav() {
  const nav    = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  if (!nav || !toggle) return;

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('mobile-open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('mobile-open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ── HERO WORD REVEAL ── */
function splitWords(el) {
  if (!el) return [];
  const rawHTML = el.innerHTML;
  // Preserve <br> tags, split everything else by word
  const parts = rawHTML.split(/(<br\s*\/?>)/i);
  el.innerHTML = parts.map(part => {
    if (/^<br/i.test(part)) return part;
    return part.split(' ').filter(Boolean).map(word =>
      `<span class="word-outer"><span class="word-inner">${word}</span></span>`
    ).join(' ');
  }).join('');
  return el.querySelectorAll('.word-inner');
}

function initHeroReveal() {
  if (typeof gsap === 'undefined' || REDUCED_MOTION) {
    // Fallback: make everything visible immediately
    document.querySelectorAll('.hero__eyebrow, .hero__sub, .hero__actions, .hero__scroll').forEach(el => {
      el.style.opacity = '1';
    });
    document.querySelectorAll('.word-inner').forEach(el => {
      el.style.transform = 'none';
    });
    return;
  }

  const headline  = document.querySelector('.hero__headline');
  const sub       = document.querySelector('.hero__sub');
  const actions   = document.querySelector('.hero__actions');
  const eyebrow   = document.querySelector('.hero__eyebrow');
  const heroScroll = document.querySelector('.hero__scroll');

  const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });

  // Eyebrow fade
  if (eyebrow) {
    tl.fromTo(eyebrow, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8 }, 0.1);
  }

  // Headline word reveal — words are pre-split in HTML to avoid mangling nested spans
  if (headline) {
    const words = headline.querySelectorAll('.word-inner');
    if (words.length) {
      tl.fromTo(words,
        { yPercent: 110 },
        { yPercent: 0, duration: 1.4, stagger: 0.08 },
        0.3
      );
    }
  }

  // Sub fade up
  if (sub) {
    tl.fromTo(sub, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1 }, 0.9);
  }

  // Actions fade up
  if (actions) {
    tl.fromTo(actions, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 1.1);
  }

  // Scroll indicator
  if (heroScroll) {
    tl.fromTo(heroScroll, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.5);
  }

  // Hero background parallax
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.3,
      }
    });
  }
}

/* ── SCROLL REVEAL (fade-up + section headings) ── */
function initScrollReveal() {
  if (typeof gsap === 'undefined' || REDUCED_MOTION) {
    document.querySelectorAll('.reveal, .reveal-line, .fade-up').forEach(el => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
    return;
  }

  // Generic fade-up elements
  gsap.utils.toArray('.fade-up').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: EASE_OUT,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });

  // Section heading word reveals
  gsap.utils.toArray('.reveal').forEach(el => {
    const words = splitWords(el);
    if (!words.length) return;
    gsap.fromTo(words,
      { yPercent: 110 },
      {
        yPercent: 0, duration: 1.2, stagger: 0.06, ease: EASE_OUT,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });

  // Single line reveals (borders, labels)
  gsap.utils.toArray('.reveal-line').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.7, ease: EASE_OUT,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });

  // Staggered children
  gsap.utils.toArray('.reveal-stagger').forEach(parent => {
    const children = parent.children;
    gsap.fromTo(children,
      { opacity: 0, y: 32 },
      {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: EASE_OUT,
        scrollTrigger: { trigger: parent, start: 'top 85%', once: true }
      }
    );
  });

  // Horizontal line expanders
  gsap.utils.toArray('.line-expand').forEach(el => {
    gsap.fromTo(el,
      { scaleX: 0, transformOrigin: 'left' },
      {
        scaleX: 1, duration: 1.2, ease: EASE_OUT,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });
}

/* ── PARALLAX ── */
function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || REDUCED_MOTION) return;

  // Parallax image sections
  gsap.utils.toArray('.parallax-section').forEach(section => {
    const bg = section.querySelector('.parallax-section__bg');
    if (!bg) return;
    gsap.fromTo(bg,
      { yPercent: -12 },
      {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        }
      }
    );
  });

  // Editorial image columns
  gsap.utils.toArray('.editorial-img').forEach((img, i) => {
    const dir = i % 2 === 0 ? -8 : 8;
    gsap.fromTo(img,
      { yPercent: dir },
      {
        yPercent: -dir,
        ease: 'none',
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        }
      }
    );
  });
}

/* ── STATS COUNTERS ── */
function initCounters() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.utils.toArray('.stat__number[data-target]').forEach(el => {
    const target  = parseFloat(el.dataset.target);
    const prefix  = el.dataset.prefix  || '';
    const suffix  = el.dataset.suffix  || '';
    const isFloat = el.dataset.float === 'true';
    const obj     = { val: 0 };
    // Reset to 0 so the animation always plays from zero
    el.textContent = prefix + '0' + suffix;

    gsap.to(obj, {
      val: target,
      duration: 2.2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      onUpdate() {
        el.textContent = prefix + (isFloat
          ? obj.val.toFixed(1)
          : Math.round(obj.val)) + suffix;
      },
      onComplete() {
        el.textContent = prefix + (isFloat ? target.toFixed(1) : target) + suffix;
      }
    });
  });
}

/* ── FAQ ACCORDION ── */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ── CONTACT FORM ── */
function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(field => {
    field.addEventListener('blur',  () => validateField(field));
    field.addEventListener('input', () => clearFieldError(field));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const btn = form.querySelector('.form-submit');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        form.style.display = 'none';
        document.getElementById('form-success')?.classList.add('visible');
      } else throw new Error();
    } catch {
      btn.textContent = orig;
      btn.disabled = false;
      showFormError(form, 'Something went wrong. Email dianachutherapy@gmail.com directly.');
    }
  });
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(f => { if (!validateField(f)) valid = false; });
  return valid;
}
function validateField(f) {
  clearFieldError(f);
  const val = f.value.trim();
  if (f.hasAttribute('required') && !val) { showFieldError(f, 'Required.'); return false; }
  if (f.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    showFieldError(f, 'Please enter a valid email.'); return false;
  }
  return true;
}
function showFieldError(f, msg) {
  f.style.borderColor = '#B87070';
  f.setAttribute('aria-invalid', 'true');
  const s = document.createElement('span');
  s.className = 'field-error';
  s.setAttribute('role', 'alert');
  s.textContent = msg;
  f.closest('.form-group').appendChild(s);
}
function clearFieldError(f) {
  f.style.borderColor = '';
  f.removeAttribute('aria-invalid');
  f.closest('.form-group')?.querySelector('.field-error')?.remove();
}
function showFormError(form, msg) {
  form.querySelector('.form-error')?.remove();
  const p = document.createElement('p');
  p.className = 'form-error'; p.setAttribute('role', 'alert'); p.textContent = msg;
  form.querySelector('.form-submit').after(p);
}

/* ── EXIT INTENT POPUP ── */
function initExitIntent() {
  const popup = document.getElementById('exit-popup');
  if (!popup) return;

  // Don't show on contact page — already converting
  if (document.body.classList.contains('page-contact')) return;

  // Only show once per session
  if (sessionStorage.getItem('exit-popup-shown')) return;

  let triggered = false;
  function showPopup() {
    if (triggered) return;
    triggered = true;
    sessionStorage.setItem('exit-popup-shown', '1');
    popup.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    popup.classList.remove('visible');
    document.body.style.overflow = '';
  }

  // Desktop: mouse leaves toward top of page
  document.addEventListener('mouseleave', e => {
    if (e.clientY < 10) showPopup();
  });

  // Mobile: show after 45s if user hasn't converted
  const mobileTimer = setTimeout(() => {
    if (window.innerWidth <= 900) showPopup();
  }, 45000);

  popup.querySelector('.exit-popup__close')?.addEventListener('click', closePopup);
  popup.querySelector('.exit-popup__dismiss')?.addEventListener('click', closePopup);
  popup.querySelector('.exit-popup__backdrop')?.addEventListener('click', closePopup);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePopup();
  });

  // Clean up timer if user converts
  document.querySelector('.exit-popup__card .btn')?.addEventListener('click', () => {
    clearTimeout(mobileTimer);
  });
}

/* ── NEWSLETTER FORM ── */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const input = form.querySelector('input[type="email"]');
    if (!input.value.trim()) return;

    btn.textContent = 'Subscribing…';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        form.innerHTML = '<p style="color:var(--gold);font-family:var(--font-sans);font-size:13px;letter-spacing:0.06em;">You\'re in. Look out for insights in your inbox.</p>';
      } else throw new Error();
    } catch {
      btn.textContent = 'Subscribe';
      btn.disabled = false;
    }
  });
}
