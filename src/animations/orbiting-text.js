/**
 * Orbiting Text Animation - Similar to maxmilkin.com
 * Circular text rotating around the hero title
 */
import { gsap } from 'gsap';

let orbitAnimation = null;

/**
 * Initialize the orbiting text effect
 */
export function initOrbitingText() {
  console.log('🌀 Initializing orbiting text...');
  
  const orbitContainer = document.getElementById('orbiting-text');
  if (!orbitContainer) {
    console.warn('⚠️ Orbiting text container not found');
    return;
  }
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Keep text static or very slow if user prefers reduced motion
    console.log('📌 Reduced motion detected - static orbit');
    gsap.set(orbitContainer, { opacity: 0.6 });
    return;
  }
  
  // Base rotation speed (degrees per second)
  const baseSpeed = 8; // Very slow, elegant rotation
  
  // Create infinite rotation
  orbitAnimation = gsap.to(orbitContainer, {
    rotation: 360,
    duration: 360 / baseSpeed, // Calculate duration based on speed
    ease: 'none',
    repeat: -1,
    paused: false
  });
  
  // Desktop: Cursor interaction (subtle speed variation)
  if (window.matchMedia('(pointer: fine)').matches) {
    setupCursorInteraction(orbitContainer, orbitAnimation, baseSpeed);
  }
  
  // Mobile: Keep constant rotation
  console.log('✅ Orbiting text initialized');
}

/**
 * Setup cursor interaction for desktop
 */
function setupCursorInteraction(container, animation, baseSpeed) {
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;
  
  let currentSpeed = baseSpeed;
  let rafId = null;
  
  // Throttled mouse move handler for better performance
  heroSection.addEventListener('mousemove', (e) => {
    if (rafId) return;
    
    rafId = requestAnimationFrame(() => {
      const rect = heroSection.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate distance and angle from center
      const deltaX = e.clientX - rect.left - centerX;
      const deltaY = e.clientY - rect.top - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Normalize distance (0 to 1)
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const normalizedDistance = Math.min(distance / maxDistance, 1);
      
      // Subtle speed variation: slower near center, slightly faster at edges
      const speedMultiplier = 0.75 + (normalizedDistance * 0.5); // Range: 0.75x to 1.25x
      const newSpeed = baseSpeed * speedMultiplier;
      
      // Only update if change is significant enough (avoid jitter)
      if (Math.abs(newSpeed - currentSpeed) > 0.3) {
        currentSpeed = newSpeed;
        
        // Update animation duration smoothly
        gsap.to(animation, {
          timeScale: speedMultiplier,
          duration: 0.8,
          ease: 'power2.out'
        });
      }
      
      // Subtle 3D tilt effect based on cursor position
      const tiltX = (deltaY / centerY) * 2; // Max ±2 degrees
      const tiltY = (deltaX / centerX) * -2;
      
      gsap.to(container, {
        rotationX: tiltX,
        rotationY: tiltY,
        duration: 1.2,
        ease: 'power2.out'
      });
      
      rafId = null;
    });
  });
  
  // Reset on mouse leave with smooth transition
  heroSection.addEventListener('mouseleave', () => {
    gsap.to(animation, {
      timeScale: 1,
      duration: 1.5,
      ease: 'power2.inOut'
    });
    
    gsap.to(container, {
      rotationX: 0,
      rotationY: 0,
      duration: 1.5,
      ease: 'power2.inOut'
    });
    
    currentSpeed = baseSpeed;
  });
}

/**
 * Clean up animation on page leave
 */
export function cleanupOrbitingText() {
  if (orbitAnimation) {
    orbitAnimation.kill();
    orbitAnimation = null;
  }
}
