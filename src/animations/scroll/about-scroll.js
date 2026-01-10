import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { log } from '@/utils/logger.js';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize About Section Scroll Animations
 * Reveals paragraphs and inline icons as user scrolls
 */
export function initAboutAnimations() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Skip animations but ensure visibility
    gsap.set('.about-text', { opacity: 1 });
    gsap.set('.inline-icon', { opacity: 1, scale: 1, rotation: 0 });
    return;
  }

  // Animate paragraphs on scroll
  gsap.utils.toArray('.about-text').forEach((elem) => {
    gsap.from(elem, {
      scrollTrigger: {
        trigger: elem,
        start: 'top 80%', // Start when element is 80% from top
        once: true, // Only animate once
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  });

  // Animate inline icons with rotation and scale
  gsap.utils.toArray('.inline-icon').forEach((icon, i) => {
    gsap.from(icon, {
      scrollTrigger: {
        trigger: icon,
        start: 'top 85%',
        once: true
      },
      scale: 0,
      rotation: 180,
      opacity: 0,
      duration: 0.6,
      delay: i * 0.05, // Slight stagger
      ease: 'back.out(1.7)'
    });
  });

  log('✨ About section scroll animations initialized');
}

/**
 * Cleanup About animations
 */
export function destroyAboutAnimations() {
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.vars.trigger && trigger.vars.trigger.closest('#about')) {
      trigger.kill();
    }
  });
  log('🧹 About animations cleaned up');
}
