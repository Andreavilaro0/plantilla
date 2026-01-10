import gsap from 'gsap';
import { log } from '@/utils/logger.js';

/**
 * Hero Section Entrance Animations - HUD Layout
 * Clarisse Michard inspired with staggered reveals
 */
export function initTitleAnimations() {
  // Wait for DOM to be ready
  requestAnimationFrame(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Skip animations but ensure visibility
      gsap.set('.hero-title .word', { opacity: 1, y: 0 });
      gsap.set('.hud-corners > *', { opacity: 0.6 });
      gsap.set('.hero-info', { opacity: 1 });
      gsap.set('.hero-socials', { opacity: 1 });
      return;
    }

    // Create master timeline for sequence control
    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out'
      }
    });

    // === PHASE 1: HUD Elements Fade In (Stagger) ===
    tl.from('.hud-corners > *', {
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
    }, 0);

    // === PHASE 2: Hero Title Words (Stagger with Y movement) ===
    tl.from('.hero-title .word', {
      y: 80,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      clearProps: 'all' // Clear inline styles after animation
    }, 0.3);

    // === PHASE 3: Subtitle Fade ===
    tl.from('.hero-subtitle', {
      opacity: 0,
      y: 20,
      duration: 0.8
    }, 1);



    // === PHASE 6: Info Panel Slide In ===
    tl.from('.hero-info', {
      x: 50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    }, 1.5);

    // === PHASE 7: Social Links Fade ===
    tl.from('.hero-socials', {
      opacity: 0,
      y: 20,
      duration: 0.8
    }, 2);

    // Stagger individual social links
    tl.from('.hero-socials a', {
      opacity: 0,
      x: -10,
      duration: 0.4,
      stagger: 0.1
    }, 2.2);

    log('✨ Hero HUD animations initialized');
  });
}

/**
 * Cleanup function for animations if needed
 */
export function destroyTitleAnimations() {
  // Future: Add cleanup if using ScrollTrigger or other persistent animations
  log('🧹 Hero animations cleaned up');
}
