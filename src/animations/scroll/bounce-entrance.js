import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Bounce Entrance Animation
 * Replicates Paul Factory's CSS bounceUp keyframe using GSAP + ScrollTrigger
 * 
 * Original CSS @keyframes bounceUp:
 * 0%  : opacity 0, translateY(10px), scale(0.95), skewY(5deg), rotate(3deg)
 * 50% : opacity 1, translateY(-4px), scale(1), skewY(0), rotate(0)
 * 100%: opacity 1, translateY(0), scale(1), skewY(0), rotate(0)
 */

export function initBounceEntrance() {
  const sections = document.querySelectorAll('[data-bounce-section]');
  
  if (sections.length === 0) {
    console.warn('⚠️ No [data-bounce-section] elements found');
    return;
  }
  
  sections.forEach((section) => {
    const words = section.querySelectorAll('.word');
    
    if (words.length === 0) {
      console.warn('⚠️ No .word elements found in', section);
      return;
    }
    
    // Set initial state (CSS keyframe 0%)
    gsap.set(words, {
      opacity: 0,
      y: 10,
      scale: 0.95,
      skewY: 5,
      rotate: 3
    });
    
    // Create GSAP timeline for two-phase animation
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        // Optional: Remove transforms after animation completes
        gsap.set(words, { clearProps: 'skewY,rotate' });
      }
    });
    
    // Phase 1: Bounce up (0% → 50% in CSS)
    tl.to(words, {
      opacity: 1,
      y: -4,
      scale: 1,
      skewY: 0,
      rotate: 0,
      duration: 0.3,
      ease: 'power2.out',
      stagger: 0.035  // 35ms between each word (Paul Factory timing)
    });
    
    // Phase 2: Settle down (50% → 100% in CSS)
    tl.to(words, {
      y: 0,
      duration: 0.25,
      ease: 'power1.inOut',
      stagger: 0.035
    }, '+=0'); // Start immediately after phase 1
    
    // ScrollTrigger replaces Intersection Observer
    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',  // Trigger when section enters 80% viewport
      once: true,        // Only animate once
      onEnter: () => {
        tl.play();
      },
      // Debug markers (remove in production)
      // markers: true,
      // id: section.id || 'bounce-section'
    });
  });
  
  console.log(`✨ Bounce entrance initialized for ${sections.length} section(s)`);
}

/**
 * Cleanup function to destroy ScrollTriggers
 * Call this when unmounting the page/component
 */
export function destroyBounceEntrance() {
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.vars.id?.includes('bounce')) {
      trigger.kill();
    }
  });
  console.log('🧹 Bounce entrance cleaned up');
}
