/**
 * Loading Screen Animation - Inspired by maxmilkin.com
 * Circular text particles orbiting around percentage counter
 */
import { gsap } from 'gsap';

let loadingTimeline = null;
let textParticles = [];

/**
 * Initialize the loading screen with orbiting text particles
 */
export function initLoadingScreen() {
  console.log('🌀 Initializing Max Milkin style loading screen...');
  
  const loader = document.getElementById('loading-screen');
  if (!loader) {
    console.warn('⚠️ Loading screen container not found');
    return;
  }
  
  // Keywords to orbit around the center
  const keywords = [
    'EDITORIAL', 'URBANO', 'RETRATO', 
    'ARQUITECTURA', 'FOTOGRAFÍA', 'PORTFOLIO',
    'TRABAJO', 'OBRA', 'IMAGEN'
  ];
  
  // Create individual letter particles
  createTextParticles(keywords);
  
  // Animate percentage counter from 0 to 100
  animatePercentageCounter();
  
  // Create orbiting animation for text particles
  animateTextParticles();
  
  // Complete loading after animation
  completeLoading();
}

/**
 * Create individual text particle elements
 */
function createTextParticles(keywords) {
  const container = document.getElementById('orbit-particles');
  if (!container) return;
  
  textParticles = [];
  
  // Repeat keywords to fill the circle
  const repeatedKeywords = [...keywords, ...keywords];
  
  repeatedKeywords.forEach((keyword, index) => {
    // Split keyword into individual letters
    const letters = keyword.split('');
    
    letters.forEach((letter, letterIndex) => {
      const particle = document.createElement('span');
      particle.className = 'text-particle';
      particle.textContent = letter;
      
      // Calculate position on circle
      const totalLetters = repeatedKeywords.join('').length;
      const letterPosition = textParticles.length;
      const angle = (letterPosition / totalLetters) * 360;
      
      // Random radius variation for organic feel
      const baseRadius = 200;
      const radiusVariation = Math.random() * 40 - 20; // ±20px
      const radius = baseRadius + radiusVariation;
      
      // Convert polar to cartesian coordinates
      const radian = (angle * Math.PI) / 180;
      const x = Math.cos(radian) * radius;
      const y = Math.sin(radian) * radius;
      
      // Set initial position
      gsap.set(particle, {
        x: x,
        y: y,
        opacity: 0
      });
      
      container.appendChild(particle);
      textParticles.push({
        element: particle,
        angle: angle,
        radius: radius,
        speed: 0.3 + Math.random() * 0.2 // Varying speeds for organic movement
      });
    });
    
    // Add spacing between keywords
    if (index < repeatedKeywords.length - 1) {
      const spacer = document.createElement('span');
      spacer.className = 'text-particle';
      spacer.textContent = '·';
      spacer.style.opacity = '0.3';
      
      const letterPosition = textParticles.length;
      const totalLetters = repeatedKeywords.join('').length + repeatedKeywords.length;
      const angle = (letterPosition / totalLetters) * 360;
      const radius = 200 + Math.random() * 40 - 20;
      
      const radian = (angle * Math.PI) / 180;
      const x = Math.cos(radian) * radius;
      const y = Math.sin(radian) * radius;
      
      gsap.set(spacer, { x, y, opacity: 0 });
      container.appendChild(spacer);
      textParticles.push({
        element: spacer,
        angle: angle,
        radius: radius,
        speed: 0.3 + Math.random() * 0.2
      });
    }
  });
  
  console.log(`✅ Created ${textParticles.length} text particles`);
}

/**
 * Animate percentage counter from 0 to 100
 */
function animatePercentageCounter() {
  const counter = document.getElementById('loading-percentage');
  if (!counter) return;
  
  const counterObject = { value: 0 };
  
  gsap.to(counterObject, {
    value: 100,
    duration: 3,
    ease: 'power2.inOut',
    onUpdate: () => {
      counter.textContent = Math.floor(counterObject.value) + '%';
    }
  });
}

/**
 * Animate text particles in orbital motion
 */
function animateTextParticles() {
  // Fade in particles
  textParticles.forEach((particle, index) => {
    gsap.to(particle.element, {
      opacity: 0.7,
      duration: 0.5,
      delay: 0.1 + (index * 0.01),
      ease: 'power2.out'
    });
  });
  
  // Continuous rotation animation
  const rotationSpeed = 8; // degrees per second
  
  textParticles.forEach((particle) => {
    gsap.to(particle, {
      angle: particle.angle + 360,
      duration: 360 / (rotationSpeed * particle.speed),
      repeat: -1,
      ease: 'none',
      onUpdate: () => {
        const radian = (particle.angle * Math.PI) / 180;
        const x = Math.cos(radian) * particle.radius;
        const y = Math.sin(radian) * particle.radius;
        
        gsap.set(particle.element, { x, y });
      }
    });
  });
}

/**
 * Complete loading and transition to main content
 */
function completeLoading() {
  setTimeout(() => {
    const loader = document.getElementById('loading-screen');
    const heroSection = document.getElementById('hero');
    const navbar = document.querySelector('.global-header');
    
    if (loader && heroSection) {
      // Fade out loader
      gsap.to(loader, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          loader.style.display = 'none';
          
          // Trigger hero animations
          if (window.initHero3D) {
            window.initHero3D();
          }
        }
      });
      
      // Fade in hero
      gsap.to(heroSection, {
        opacity: 1,
        duration: 1,
        delay: 0.3,
        ease: 'power2.out'
      });
      
      // Fade in navbar
      if (navbar) {
        gsap.to(navbar, {
          opacity: 1,
          duration: 1,
          delay: 0.5,
          ease: 'power2.out'
        });
      }
    }
  }, 3500); // Wait for percentage to complete
}

/**
 * Clean up loading screen
 */
export function cleanupLoadingScreen() {
  textParticles.forEach(particle => {
    if (particle.element && particle.element.parentNode) {
      particle.element.parentNode.removeChild(particle.element);
    }
  });
  textParticles = [];
  
  if (loadingTimeline) {
    loadingTimeline.kill();
    loadingTimeline = null;
  }
}
