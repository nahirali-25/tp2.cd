/**
 * animations.js — Feria Internacional del Libro Buenos Aires 2026
 * Sin dependencias externas. Usa las clases fl-* de styles.css.
 *
 * Agregar antes del </body> en TODOS los HTML:
 *   <script src="js/animations.js"></script>
 */

(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. HERO FADE-UP ──────────────────────────────────────────────────────
   * Anima los hijos directos del hero y del page-header al cargar.
   * ────────────────────────────────────────────────────────────────────── */
  function initHeroFade() {
    if (reduced) return;
    const containers = document.querySelectorAll('.fl-hero-content, .fl-page-header-content');
    containers.forEach(function (c) {
      Array.from(c.children).forEach(function (el, i) {
        el.classList.add('fl-anim-fade-up');
        el.style.animationDelay = (i * 0.13) + 's';
      });
    });
  }

  /* ── 2. SCROLL REVEAL (IntersectionObserver) ──────────────────────────────
   * Agrega fl-reveal a cards, columnas e imágenes fuera del viewport inicial.
   * ────────────────────────────────────────────────────────────────────── */
  function initScrollReveal() {
    if (reduced) return;
    if (!('IntersectionObserver' in window)) return;

    var targets = document.querySelectorAll(
      '.fl-card, .fl-srv-card, .fl-prod-link, .fl-stat-card, ' +
      '.fl-info-card, .fl-faq-item, .fl-order-card, ' +
      '.fl-section > .container > .row > [class*="col"]'
    );

    var vhLimit = window.innerHeight * 0.88;

    targets.forEach(function (el) {
      if (el.getBoundingClientRect().top < vhLimit) return; // ya visible
      el.classList.add('fl-reveal');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('fl-visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.10 });

    document.querySelectorAll('.fl-reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── 3. NAVBAR SHRINK ─────────────────────────────────────────────────────
   * Compacta la navbar al bajar más de 60px.
   * ────────────────────────────────────────────────────────────────────── */
  function initNavShrink() {
    var nav = document.querySelector('.fl-nav');
    if (!nav) return;

    function update() {
      nav.classList.toggle('fl-nav-shrunk', window.scrollY > 60);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ── 4. RIPPLE EN BOTONES ─────────────────────────────────────────────────
   * Onda táctil en todos los botones fl-btn-*.
   * ────────────────────────────────────────────────────────────────────── */
  function initRipple() {
    if (reduced) return;

    document.addEventListener('click', function (e) {
      var btn = e.target.closest(
        '.fl-btn-primary, .fl-btn-outline, .fl-btn-ghost, .fl-btn-nav, .fl-btn-sm'
      );
      if (!btn) return;

      var old = btn.querySelector('.fl-ripple');
      if (old) old.remove();

      var d    = Math.max(btn.clientWidth, btn.clientHeight);
      var rect = btn.getBoundingClientRect();
      var rip  = document.createElement('span');
      rip.classList.add('fl-ripple');
      rip.style.cssText =
        'width:' + d + 'px;height:' + d + 'px;' +
        'left:' + (e.clientX - rect.left - d / 2) + 'px;' +
        'top:'  + (e.clientY - rect.top  - d / 2) + 'px;';
      btn.appendChild(rip);
      setTimeout(function () { rip.remove(); }, 580);
    });
  }

  /* ── 5. ACTIVE LINK en la navbar ─────────────────────────────────────────
   * Marca el link de la página actual.
   * ────────────────────────────────────────────────────────────────────── */
  function initActiveNav() {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.fl-nav-links a, .fl-nav-dropdown a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href === current || (current === 'index.html' && (href === '' || href === './'))) {
        a.classList.add('active');
      }
    });
  }

  /* ── 6. SMOOTH SCROLL para anclas internas ───────────────────────────────
   * ────────────────────────────────────────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id  = this.getAttribute('href');
        var tgt = document.querySelector(id);
        if (!tgt) return;
        e.preventDefault();
        tgt.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  /* ── INIT ─────────────────────────────────────────────────────────────── */
  function init() {
    initHeroFade();
    initNavShrink();
    initRipple();
    initActiveNav();
    initSmoothScroll();
    requestAnimationFrame(initScrollReveal);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
