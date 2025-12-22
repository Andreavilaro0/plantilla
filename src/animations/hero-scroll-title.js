import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let revealTL = null;
let scrubTL = null;
let scrubTrigger = null;

export function initTitleAnimations() {
  const hero = document.querySelector('#hero');
  const title = document.querySelector('#hero-title');
  if (!hero || !title) return;

  // Cleanup potential previous instances
  killTitleAnimations();

  const line1 = title.querySelector('.line-1');
  const line2 = title.querySelector('.line-2');
  const lines = title.querySelectorAll('.title-line');

  // ============================================
  // 1. REVEAL ANIMATION (Curtain Reveal)
  // ============================================
  // Set initial state for lines (hidden below mask)
  gsap.set(lines, { y: '110%' });

  revealTL = gsap.timeline({
    defaults: { ease: 'power3.out', duration: 1.2 }
  });

  revealTL.to(lines, {
    y: '0%',
    stagger: 0.1,
    // When reveal completes, ensure they are clean for scrub
    onComplete: () => {
      // Optional: clear explicit transform style if needed, 
      // but keeping it at 0 is fine for scrub start.
    }
  });

  // ============================================
  // 2. SCROLL REACTIVE (Scrub)
  // ============================================
  // Important: Use overwrite 'auto' so scrub takes over if user scrolls 
  // during reveal.

  scrubTL = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8,
      id: 'hero-title-scrub'
    }
  });

  // Title Scale
  scrubTL.to(title, {
    scale: 0.92,
    opacity: 0.86,
    ease: 'none',
    overwrite: 'auto'
  }, 0);

  // Parallax Lines (Aggressive separation)
  if (line1) {
    scrubTL.to(line1, {
      y: -22,
      x: -12,
      ease: 'none',
      overwrite: 'auto'
    }, 0);
  }

  if (line2) {
    scrubTL.to(line2, {
      y: 26,
      x: 16,
      ease: 'none',
      overwrite: 'auto'
    }, 0);
  }

  scrubTrigger = scrubTL.scrollTrigger;
  console.log('✅ Advanced Title Animations Initialized');
}

export function killTitleAnimations() {
  if (revealTL) {
    revealTL.kill();
    revealTL = null;
  }
  if (scrubTL) {
    scrubTL.kill();
    scrubTL = null;
  }
  if (scrubTrigger) {
    scrubTrigger.kill();
    scrubTrigger = null;
  }
}
