/**
 * Hero Animations - Claude Monet Style
 * Entrada timeline + floating loops + mouse parallax
 */
import { gsap } from 'gsap';

// Global state
let heroAnimations = {
  tl: null,
  floatingTweens: [],
  parallaxRAF: null,
  mouseX: 0,
  mouseY: 0,
  currentX: 0,
  currentY: 0
};

export function initHeroAnimations() {
  const hero = document.querySelector('#hero');
  if (!hero) return;

  // Kill previous instances (HMR safety)
  cleanupHeroAnimations();

  // Elementos
  const monet = hero.querySelector('.hero-monet');
  const impressions = hero.querySelector('.hero-impressions');
  const subtitle = hero.querySelector('.hero-subtitle');
  const cta = hero.querySelector('.hero-cta-row');
  const floats = hero.querySelectorAll('.hero-float');

  // ============================================
  // 1. ENTRADA TIMELINE
  // ============================================
  heroAnimations.tl = gsap.timeline({ delay: 0.3 });

  // Título "MONET" (izquierda)
  if (monet) {
    heroAnimations.tl.from(monet, {
      opacity: 0,
      y: 20,
      duration: 1.0,
      ease: 'power3.out'
    });
  }

  // Título "IMPRESSIONS" (derecha, con delay)
  if (impressions) {
    heroAnimations.tl.from(impressions, {
      opacity: 0,
      y: 20,
      duration: 1.0,
      ease: 'power3.out'
    }, '-=0.7');
  }

  // Subtitle
  if (subtitle) {
    heroAnimations.tl.from(subtitle, {
      opacity: 0,
      y: 10,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.5');
  }

  // CTA row (button + arrow)
  if (cta) {
    heroAnimations.tl.from(cta, {
      opacity: 0,
      y: 10,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.6');
  }

  // Cuadros flotantes (stagger)
  if (floats.length > 0) {
    heroAnimations.tl.from(floats, {
      opacity: 0,
      y: 12,
      duration: 1.2,
      stagger: 0.08,
      ease: 'power2.out'
    }, '-=0.8');
  }

  // ============================================
  // 2. FLOATING LOOPS (cada cuadro)
  // ============================================
  floats.forEach((float, index) => {
    const depth = parseInt(float.dataset.depth) || 2;
    
    // Movimiento Y (sube/baja)
    const yTween = gsap.to(float, {
      y: depth === 1 ? 12 : (depth === 2 ? 8 : 6),
      duration: 4.5 + (index * 0.5),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.15
    });
    heroAnimations.floatingTweens.push(yTween);

    // Rotación sutil
    const rotateTween = gsap.to(float, {
      rotation: depth === 1 ? 1.2 : (depth === 2 ? 0.8 : 0.5),
      duration: 5.5 + (index * 0.3),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.2
    });
    heroAnimations.floatingTweens.push(rotateTween);
  });

  // ============================================
  // 3. MOUSE PARALLAX (suave con LERP)
  // ============================================
  const handleMouseMove = (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Normalized -1 to 1
    heroAnimations.mouseX = (e.clientX - centerX) / centerX;
    heroAnimations.mouseY = (e.clientY - centerY) / centerY;
  };

  const lerp = (start, end, factor) => start + (end - start) * factor;

  const animateParallax = () => {
    // Smooth interpolation
    heroAnimations.currentX = lerp(heroAnimations.currentX, heroAnimations.mouseX, 0.05);
    heroAnimations.currentY = lerp(heroAnimations.currentY, heroAnimations.mouseY, 0.05);

    floats.forEach((float) => {
      const depth = parseInt(float.dataset.depth) || 2;
      const factor = depth === 1 ? 15 : (depth === 2 ? 10 : 6);

      const x = heroAnimations.currentX * factor;
      const y = heroAnimations.currentY * factor;

      gsap.set(float, {
        x,
        y,
        overwrite: 'auto'
      });
    });

    heroAnimations.parallaxRAF = requestAnimationFrame(animateParallax);
  };

  // Iniciar parallax
  window.addEventListener('mousemove', handleMouseMove);
  animateParallax();
}

export function cleanupHeroAnimations() {
  // Kill timeline
  if (heroAnimations.tl) {
    heroAnimations.tl.kill();
    heroAnimations.tl = null;
  }

  // Kill floating tweens
  heroAnimations.floatingTweens.forEach(tween => tween.kill());
  heroAnimations.floatingTweens = [];

  // Cancel parallax RAF
  if (heroAnimations.parallaxRAF) {
    cancelAnimationFrame(heroAnimations.parallaxRAF);
    heroAnimations.parallaxRAF = null;
  }

  // Remove mouse listener
  window.removeEventListener('mousemove', handleMouseMove);

  // Reset state
  heroAnimations.mouseX = 0;
  heroAnimations.mouseY = 0;
  heroAnimations.currentX = 0;
  heroAnimations.currentY = 0;
}

// Auto-init en window.load
if (typeof window !== 'undefined') {
  window.addEventListener('load', initHeroAnimations);
}
