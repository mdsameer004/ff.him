/**
 * floral-effects.js
 * Friends Florist — Floating Petals, Parallax & Scroll Reveal
 * Lightweight, no dependencies, ~80 lines
 */

(function () {
  'use strict';

  const petalShapes = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36"><path d="M12,2 C18,10 20,22 12,34 C4,22 6,10 12,2Z" fill="none" stroke="currentColor" stroke-width="1"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><ellipse cx="14" cy="14" rx="10" ry="13" fill="none" stroke="currentColor" stroke-width="1"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><path d="M15,3 C20,8 22,16 15,27 C8,16 10,8 15,3Z" fill="none" stroke="currentColor" stroke-width="1"/><path d="M15,3 C15,3 10,14 15,27" fill="none" stroke="currentColor" stroke-width="0.5"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><ellipse cx="16" cy="7" rx="4" ry="7" fill="none" stroke="currentColor" stroke-width="0.8"/><ellipse cx="16" cy="7" rx="4" ry="7" transform="rotate(72 16 16)" fill="none" stroke="currentColor" stroke-width="0.8"/><ellipse cx="16" cy="7" rx="4" ry="7" transform="rotate(144 16 16)" fill="none" stroke="currentColor" stroke-width="0.8"/><ellipse cx="16" cy="7" rx="4" ry="7" transform="rotate(216 16 16)" fill="none" stroke="currentColor" stroke-width="0.8"/><ellipse cx="16" cy="7" rx="4" ry="7" transform="rotate(288 16 16)" fill="none" stroke="currentColor" stroke-width="0.8"/><circle cx="16" cy="16" r="3" fill="none" stroke="currentColor" stroke-width="0.8"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36"><path d="M12,2 C20,8 22,20 14,34 C12,30 4,18 12,2Z" fill="none" stroke="currentColor" stroke-width="1"/><path d="M12,2 L14,34" fill="none" stroke="currentColor" stroke-width="0.5"/></svg>`,
  ];

  const petalColors = ['#FADADD','#B2C9AD','#E8D5F5','#FFD1A4','#D4A5A5'];

  function createPetals() {
    if (window.innerWidth < 768) return;
    const count = 10;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'floral-petal';
      const size  = 18 + Math.random() * 22;
      const left  = Math.random() * 100;
      const dur   = 18 + Math.random() * 18;
      const delay = Math.random() * -30;
      const drift = (Math.random() - 0.5) * 120;
      const opac  = 0.07 + Math.random() * 0.05;
      el.style.cssText = `left:${left}vw;width:${size}px;height:${size}px;color:${petalColors[i%petalColors.length]};--petal-dur:${dur}s;--petal-delay:${delay}s;--petal-drift:${drift}px;--petal-opacity:${opac};`;
      el.innerHTML = petalShapes[i % petalShapes.length];
      document.body.appendChild(el);
    }
  }

  function initParallax() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          hero.style.setProperty('--parallax-y', `${window.scrollY * 0.25}px`);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function initScrollReveal() {
    const targets = document.querySelectorAll('.home-section, .page-section');
    if (!targets.length || !('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('floral-reveal','is-visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    targets.forEach(t => obs.observe(t));
  }

  function init() {
    createPetals();
    initParallax();
    initScrollReveal();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
