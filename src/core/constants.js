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
  HERO: '#hero',
  CONTACT: '#contact',
  CONTACT_CTA: '#contact-cta'
};

/**
 * Timing Constants (milliseconds)
 */
export const TIMING = {
  ANIMATION_DURATION: 800,
  SCROLL_REFRESH_DELAY: 100,
  VIEW_MOUNT_DELAY: 150,
  PIXEL_REVEAL_DELAY: 2000,
  DOM_READY_TIMEOUT: 5000
};

/**
 * Animation Configuration
 */
export const ANIMATION_CONFIG = {
  EASE: 'power2.out',
  STAGGER: 0.03,
  REDUCED_MOTION: typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false
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
