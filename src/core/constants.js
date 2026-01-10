// core/constants.js
// Centralized constants for selectors, timing, and configuration

/**
 * DOM Selectors
 */
export const SELECTORS = {
  APP: '#app',
  PORTFOLIO: '#portfolio',
  PORTFOLIO_GRID: '#portfolio-grid',
  PORTFOLIO_EMPTY: '#portfolio-empty',
  ABOUT: '#about',
  NAVBAR: '#navbar',
  MOBILE_MENU: '#mobile-menu',
  MOBILE_MENU_BUTTON: '#mobile-menu-button',
  MODAL_ROOT: '#modal-root',
  HERO: '#hero',
  CONTACT: '#contact',
  CONTACT_CTA: '#contact-cta'
};

/**
 * Timing Constants (milliseconds)
 */
export const TIMING = {
  ANIMATION_DURATION: 800,
  ANIMATION_FAST: 200,
  ANIMATION_NORMAL: 400,
  
  SCROLL_REFRESH_DELAY: 100,
  VIEW_MOUNT_DELAY: 150,
  PIXEL_REVEAL_DELAY: 2000,
  DOM_READY_TIMEOUT: 5000,
  
  // Modal timings
  MODAL_FADE_IN: 220,
  MODAL_CONTENT_IN: 400,
  MODAL_FADE_OUT: 200,
  MODAL_CONTENT_OUT: 250,
  
  // About controller
  WORD_CHANGE_INTERVAL: 2500,
  WORD_TRANSITION_DURATION: 400,
  
  // Init delays
  INIT_DELAY: 100,
  SCROLL_DEBOUNCE: 16, // ~60fps
};

/**
 * Animation Configuration
 */
export const ANIMATION_CONFIG = {
  EASE: 'power2.out',
  STAGGER: 0.03,
  REDUCED_MOTION: typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false,
    
  BOUNCE: {
    EASE: 'power2.out',
    DURATION: 0.6,
    STAGGER: 0.035,
  },
};

/**
 * Route Paths
 */
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  SERVICES: '/services',
  PORTFOLIO: '/portfolio'
};

/**
 * Z-Index Layers
 */
export const Z_INDEX = {
  BELOW: -1,
  BASE: 0,
  NAVBAR: 1000,
  MODAL_OVERLAY: 9000,
  MODAL_CONTENT: 9100,
};

/**
 * Scroll Configuration
 */
export const SCROLL_CONFIG = {
  NAVBAR_SHOW_THRESHOLD: 50,
  NAVBAR_HIDE_BOTTOM_THRESHOLD: 100,
  SECTION_HIGHLIGHT_OFFSET: -100,
};

/**
 * CSS Classes
 */
export const CSS_CLASSES = {
  HIDDEN: 'hidden',
  ACTIVE: 'active',
  OPEN: 'open',
  SCROLLED: 'scrolled',
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NAVBAR_NOT_FOUND: '⚠️ Navbar elements not found',
  MODAL_ROOT_NOT_FOUND: '⚠️ Modal root not found',
  PORTFOLIO_ROOT_NOT_FOUND: '⚠️ Portfolio root element not found',
};
