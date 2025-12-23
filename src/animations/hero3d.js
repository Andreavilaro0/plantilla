/**
 * Hero 3D Animations with GSAP
 * - Initial entrance from depth
 * - Mouse tilt effect (desktop only)
 * - Scroll parallax
 * - Magnetic CTA hover
 * - Reduced motion support
 */

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHero3D() {
  // ============================================
  // 1. REDUCED MOTION DETECTION
  // ============================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Simple fade-in only, no complex animations
    gsap.set('.hero-float, .hero-title, .hero-cta', { opacity: 1 });
    console.log('⚡ Reduced motion enabled - simplified animations');
    return;
  }

  // ============================================
  // 2. INITIAL ENTRANCE ANIMATION
  // ============================================
  const frames = gsap.utils.toArray('.hero-float');
  const title = document.querySelector('.hero-title');
  const ctas = gsap.utils.toArray('.hero-cta');

  // Frames appear from depth (z: -200) with staggered timing
  gsap.from(frames, {
    z: -200,
    opacity: 0,
    duration: 1.5,
    stagger: {
      amount: 0.6,
      from: 'random'
    },
    ease: 'power3.out',
    clearProps: 'z' // Clear after animation to prevent transform issues
  });

  // Title fade-up
  if (title) {
    gsap.from(title, {
      y: 60,
      opacity: 0,
      duration: 1.2,
      delay: 0.3,
      ease: 'power2.out'
    });
  }

  // CTAs fade-up with slight delay
  gsap.from(ctas, {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  });

  // ============================================
  // 3. MOUSE TILT EFFECT (Desktop only)
  // ============================================
  if (window.matchMedia('(pointer: fine)').matches) {
    const hero = document.querySelector('#hero');
    
    if (hero && frames.length > 0) {
      hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        // Calculate relative position (-0.5 to 0.5)
        const xPct = (clientX / innerWidth - 0.5);
        const yPct = (clientY / innerHeight - 0.5);
        
        frames.forEach((frame) => {
          const depth = parseFloat(frame.dataset.depth) || 1;
          
          // Apply rotation based on mouse position and depth
          const rotateY = xPct * depth * 10; // Reduced from 15 for subtlety
          const rotateX = -yPct * depth * 10;
          
          gsap.to(frame, {
            rotateY,
            rotateX,
            duration: 0.5,
            ease: 'power2.out'
          });
        });
      });

      // Reset on mouse leave
      hero.addEventListener('mouseleave', () => {
        frames.forEach((frame) => {
          gsap.to(frame, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.8,
            ease: 'power2.out'
          });
        });
      });

      console.log('🎨 Mouse tilt enabled (desktop)');
    }
  }

  // ============================================
  // 4. SCROLL HORIZONTAL PARALLAX
  // ============================================
  const heroSection = document.querySelector('#hero');
  const slides = document.querySelector('#hero-floats');
  
  if (heroSection && slides) {
    gsap.to(slides, {
      xPercent: -15, // Subtle horizontal shift
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 1, // Smooth scrubbing
        // Don't pin - let it scroll naturally
      }
    });

    console.log('📜 Scroll parallax enabled');
  }

  // ============================================
  // 5. MAGNETIC CTA HOVER EFFECT
  // ============================================
  ctas.forEach((cta) => {
    if (!cta) return;

    cta.addEventListener('mousemove', (e) => {
      const rect = cta.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Subtle magnetic pull
      gsap.to(cta, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    cta.addEventListener('mouseleave', () => {
      gsap.to(cta, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });

  console.log('🧲 Magnetic CTAs enabled');

  // ============================================
  // 6. MOBILE OPTIMIZATIONS
  // ============================================
  gsap.matchMedia().add("(max-width: 768px)", () => {
    // Reduce animation intensity on mobile
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.trigger === heroSection) {
        st.kill(); // Disable scroll parallax on mobile
      }
    });
    
    console.log('📱 Mobile optimizations applied');
  });

  console.log('✅ Hero 3D animations initialized');
}
