import { log } from '@/utils/logger.js';
import { ERROR_MESSAGES, SCROLL_CONFIG, CSS_CLASSES } from '@/core/constants.js';

/**
 * Navbar - Minimal White Design
 * Adapted from FutureNav with smooth scroll, mobile menu, and active section highlighting
 */

// AbortController para cleanup de event listeners
let navbarAbortController = null;

export function initNavbar() {
  log('🎯 Initializing minimal navbar');
  
  // Cleanup previo si existe
  if (navbarAbortController) {
    navbarAbortController.abort();
  }
  
  // Crear nuevo AbortController
  navbarAbortController = new AbortController();
  const signal = navbarAbortController.signal;
  
  // DOM Elements
  const navbar = document.getElementById('navbar');
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!navbar || !mobileMenuButton || !mobileMenu) {
    console.warn(ERROR_MESSAGES.NAVBAR_NOT_FOUND);
    return;
  }
  
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Mobile Menu Toggle
  mobileMenuButton.addEventListener('click', () => {
    mobileMenuButton.classList.toggle(CSS_CLASSES.ACTIVE);
    
    if (mobileMenu.classList.contains(CSS_CLASSES.OPEN)) {
      mobileMenu.style.height = '0';
      mobileMenu.classList.remove(CSS_CLASSES.OPEN);
    } else {
      mobileMenu.classList.add(CSS_CLASSES.OPEN);
      // Calculate proper height for fixed positioned menu
      const linksHeight = mobileNavLinks.length * 80; // Approximate height per link
      mobileMenu.style.height = `${Math.max(linksHeight, 400)}px`;
    }
  }, { signal });

  // Close mobile menu when a link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuButton.classList.remove(CSS_CLASSES.ACTIVE);
      mobileMenu.style.height = '0';
      mobileMenu.classList.remove(CSS_CLASSES.OPEN);
    }, { signal });
  });

  // Navbar scroll effect  
  window.addEventListener('scroll', () => {
    if (window.scrollY > SCROLL_CONFIG.NAVBAR_SHOW_THRESHOLD) {
      navbar.classList.add(CSS_CLASSES.SCROLLED);
    } else {
      navbar.classList.remove(CSS_CLASSES.SCROLLED);
    }
    
    // Ocultar navbar al final de la página
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    if (scrollPosition >= documentHeight - SCROLL_CONFIG.NAVBAR_HIDE_BOTTOM_THRESHOLD) {
      navbar.classList.add('hide-at-bottom');
    } else {
      navbar.classList.remove('hide-at-bottom');
    }
    
    highlightCurrentSection();
  }, { signal });

  // Smooth scroll for nav links
  const allNavLinks = [...navLinks, ...mobileNavLinks];
  
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      
      if (!targetId || targetId === '#') return;
      
      // Close mobile menu first
      if (mobileMenuButton.classList.contains(CSS_CLASSES.ACTIVE)) {
        mobileMenuButton.classList.remove(CSS_CLASSES.ACTIVE);
        mobileMenu.style.height = '0';
        mobileMenu.classList.remove(CSS_CLASSES.OPEN);
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, { signal });
  });

  // Función para highlight de sección activa
  function highlightCurrentSection() {
    let currentSection = '';
    
    sections.forEach(section => {
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
    
    mobileNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // Initialize active section on page load
  highlightCurrentSection();
  
  log('✅ Navbar initialized');
}

// For backwards compatibility
export function setActiveLink(path) {
  // Not needed for single page navigation, but keeping for compatibility
  log('setActiveLink called with:', path);
}
