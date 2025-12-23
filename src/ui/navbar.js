/**
 * Navbar Module - GSAP Animated Navigation
 * Editorial style with vertical slide animations
 */
import { gsap } from 'gsap';
import { openAboutModal } from './aboutModal.js';

// State
let isMobileMenuOpen = false;
let abortController = null;
let scrollThreshold = 50;
let menuTimeline = null;

/**
 * Initialize navbar
 */
export function initNavbar() {
  console.log('🧭 Initializing navbar...');
  
  // Setup GSAP timeline
  setupMenuTimeline();
  
  // Setup event listeners
  setupScrollListener();
  setupMobileMenu();
  setupAboutTrigger();
  
  // Set initial active link
  setActiveLink();
  
  console.log('✅ Navbar initialized');
}

/**
 * Create GSAP timeline for bottom-slide menu animations
 * Matches CodePen demo by Mohammad Shadab Rao
 */
function setupMenuTimeline() {
  const menuOverlay = document.getElementById('menu-overlay');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuLinks = document.querySelectorAll('.menu-link');
  
  if (!mobileMenu || !menuOverlay || menuLinks.length === 0) {
    console.warn('⚠️ Mobile menu elements not found for timeline');
    return;
  }
  
  // Create paused timeline
  menuTimeline = gsap.timeline({ paused: true });
  
  // Animation sequence (CodePen replica):
  // 1. Fade in overlay (dark background) - 0 → 1 opacity
  // 2. Slide panel from bottom - translateY(100%) → 0
  // 3. Stagger links appearing from bottom - y:50 → 0, opacity:0 → 1
  menuTimeline
    // Step 1: Fade in dark overlay
    .to(menuOverlay, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.inOut'
    })
    // Step 2: Slide menu panel from bottom
    .fromTo(mobileMenu, 
      { 
        y: '100%'
      }, 
      { 
        y: 0,
        duration: 0.8,
        ease: 'power4.out'
      }, 
      '-=0.2' // Start slightly before overlay finishes
    )
    // Step 3: Stagger menu links (slide up + fade in)
    .fromTo(menuLinks, 
      {
        y: 50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      }, 
      '-=0.4' // Start while panel is still sliding
    );
}

/**
 * Handle scroll effects - add/remove 'scrolled' class
 */
function setupScrollListener() {
  const header = document.querySelector('.global-header');
  if (!header) {
    console.warn('⚠️ .global-header not found');
    return;
  }
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/**
 * Setup mobile menu (hamburger)
 */
function setupMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOverlay = document.getElementById('menu-overlay');
  
  if (!menuToggle || !mobileMenu || !menuOverlay) {
    console.warn('⚠️ Mobile menu elements not found');
    return;
  }
  
  // Open menu on hamburger click
  menuToggle.addEventListener('click', () => {
    openMobileMenu();
  });
  
  // Close menu when clicking overlay
  menuOverlay.addEventListener('click', () => {
    closeMobileMenu();
  });
  
  // Close with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMobileMenuOpen) {
      closeMobileMenu();
    }
  });
  
  // Close when clicking menu links (auto-close on navigation)
  const menuLinks = mobileMenu.querySelectorAll('.menu-link');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Small delay to allow navigation to start
      setTimeout(() => closeMobileMenu(), 100);
    });
  });
}

/**
 * Open mobile menu with GSAP animation
 */
function openMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOverlay = document.getElementById('menu-overlay');
  
  if (!mobileMenu || !menuTimeline || !menuOverlay) return;
  
  isMobileMenuOpen = true;
  
  // Update ARIA
  menuToggle?.setAttribute('aria-expanded', 'true');
  menuToggle?.setAttribute('aria-label', 'Cerrar menú');
  mobileMenu.setAttribute('aria-hidden', 'false');
  
  // Lock body scroll
  document.body.classList.add('menu-open');
  document.body.style.overflow = 'hidden';
  
  // Transform hamburger to X
  menuToggle?.classList.add('active');
  
  // Make overlay and menu visible for animation
  menuOverlay.style.pointerEvents = 'auto';
  mobileMenu.classList.add('open');
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Instant show without animation
    gsap.set(menuOverlay, { opacity: 1 });
    gsap.set(mobileMenu, { y: 0, pointerEvents: 'auto' });
    gsap.set('.menu-link', { y: 0, opacity: 1 });
    menuOverlay.classList.add('visible');
  } else {
    // Play GSAP timeline
    menuTimeline.play();
  }
  
  // Focus trap
  setupFocusTrap(mobileMenu);
  
  // Click outside to close (already handled in setupMobileMenu)
  
  // Focus first link
  const firstLink = mobileMenu.querySelector('a, button');
  firstLink?.focus();
}

/**
 * Close mobile menu with GSAP animation
 */
function closeMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOverlay = document.getElementById('menu-overlay');
  
  if (!mobileMenu || !isMobileMenuOpen || !menuTimeline || !menuOverlay) return;
  
  isMobileMenuOpen = false;
  
  // Update ARIA
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Abrir menú');
  mobileMenu.setAttribute('aria-hidden', 'true');
  
  // Restore body scroll
  document.body.classList.remove('menu-open');
  document.body.style.overflow = '';
  
  // Change X back to hamburger
  menuToggle?.classList.remove('active');
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Instant hide without animation
    gsap.set(menuOverlay, { opacity: 0 });
    gsap.set(mobileMenu, { y: '100%', pointerEvents: 'none' });
    menuOverlay.classList.remove('visible');
    menuOverlay.style.pointerEvents = 'none';
    mobileMenu.classList.remove('open');
  } else {
    // Reverse GSAP timeline
    menuTimeline.reverse();
    
    // Clean up overlay classes after animation
    setTimeout(() => {
      menuOverlay.classList.remove('visible');
      menuOverlay.style.pointerEvents = 'none';
      mobileMenu.classList.remove('open');
    }, 600); // Duration of reverse animation
  }
  
  // Remove click outside listener (handled by setupClickOutside abort)
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
  
  // Return focus to toggle button
  menuToggle?.focus();
}

/**
 * Setup focus trap inside mobile menu
 */
function setupFocusTrap(menu) {
  const focusableElements = menu.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  menu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

/**
 * Setup click outside to close menu
 */
function setupClickOutside(menu) {
  abortController = new AbortController();
  
  document.addEventListener('click', (e) => {
    const menuToggle = document.getElementById('menu-toggle');
    
    // If click is outside menu and not the toggle button
    if (!menu.contains(e.target) && e.target !== menuToggle && !menuToggle?.contains(e.target)) {
      closeMobileMenu();
    }
  }, { signal: abortController.signal });
}

/**
 * Setup animated underlines for nav links
 */
function setupLinkUnderlines() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!navLinks.length) return;
  
  // Only on devices with fine pointer (desktop)
  if (!window.matchMedia('(pointer: fine)').matches) return;
  
  navLinks.forEach(link => {
    // Get or create underline element
    let underline = link.querySelector('.link-underline');
    
    if (!underline) {
      underline = document.createElement('span');
      underline.className = 'link-underline';
      link.appendChild(underline);
    }
    
    // Set initial state
    gsap.set(underline, { scaleX: 0 });
    
    // Hover animation
    link.addEventListener('mouseenter', () => {
      gsap.to(underline, {
        scaleX: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    link.addEventListener('mouseleave', () => {
      // Don't animate out if link is active
      if (!link.classList.contains('active')) {
        gsap.to(underline, {
          scaleX: 0,
          duration: 0.3,
          ease: 'power2.in'
        });
      }
    });
    
    // Keep underline visible for active links
    if (link.classList.contains('active')) {
      gsap.set(underline, { scaleX: 1 });
    }
  });
}

/**
 * Setup About modal trigger (mobile only)
 */
function setupAboutTrigger() {
  // Mobile trigger only (desktop navigation removed)
  const mobileTrigger = document.getElementById('mobile-about-trigger');
  
  // Photographer data (should match HomeView.js)
  const photographerData = {
    name: 'Portfolio',
    portraitSrc: '/portrait.jpg',
    bio1: 'Contemporary photographer specializing in urban landscapes and architectural photography. My work explores the intersection of light, geometry, and human spaces.',
    bio2: 'Featured in various exhibitions and publications, I aim to capture the fleeting beauty of everyday moments through a unique visual perspective.',
    city: 'Barcelona, Spain',
    focus: 'Urban & Architecture'
  };
  
  if (mobileTrigger) {
    mobileTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      // Close mobile menu first
      closeMobileMenu();
      // Wait for animation to complete
      setTimeout(() => {
        openAboutModal(photographerData, mobileTrigger);
      }, 400);
    });
  }
}

/**
 * Set active link based on current route
 */
export function setActiveLink() {
  const currentPath = window.location.pathname.replace('/plantilla', '') || '/';
  const allLinks = document.querySelectorAll('.nav-link[href], .menu-link[href]');
  
  allLinks.forEach(link => {
    const href = link.getAttribute('href')?.replace('/plantilla', '');
    
    if (href === currentPath) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('active');
      
      // Animate underline for active link
      const underline = link.querySelector('.link-underline');
      if (underline) {
        gsap.set(underline, { scaleX: 1 });
      }
    } else {
      link.removeAttribute('aria-current');
      link.classList.remove('active');
      
      // Reset underline
      const underline = link.querySelector('.link-underline');
      if (underline) {
        gsap.set(underline, { scaleX: 0 });
      }
    }
  });
}

/**
 * Handle smooth scroll to anchor
 */
export function smoothScrollTo(target) {
  const element = document.querySelector(target);
  
  if (!element) return;
  
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}
