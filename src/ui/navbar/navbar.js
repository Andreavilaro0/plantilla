import { log } from '@/utils/logger.js';

/**
 * Navbar - Minimal White Design
 * Adapted from FutureNav with smooth scroll, mobile menu, and active section highlighting
 */

export function initNavbar() {
  log('🎯 Initializing minimal navbar');
  
  // DOM Elements
  const navbar = document.getElementById('navbar');
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!navbar || !mobileMenuButton || !mobileMenu) {
    console.warn('⚠️ Navbar elements not found');
    return;
  }
  
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Mobile Menu Toggle
  mobileMenuButton.addEventListener('click', () => {
    mobileMenuButton.classList.toggle('active');
    
    if (mobileMenu.classList.contains('open')) {
      mobileMenu.style.height = '0';
      mobileMenu.classList.remove('open');
    } else {
      mobileMenu.classList.add('open');
      // Calculate proper height for fixed positioned menu
      const linksHeight = mobileNavLinks.length * 80; // Approximate height per link
      mobileMenu.style.height = `${Math.max(linksHeight, 400)}px`;
    }
  });

  // Close mobile menu when a link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuButton.classList.remove('active');
      mobileMenu.style.height = '0';
      mobileMenu.classList.remove('open');
    });
  });

  // Navbar scroll effect  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Ocultar navbar al final de la página
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const threshold = 100; // Píxeles antes del final para ocultar
    
    if (scrollPosition >= documentHeight - threshold) {
      navbar.classList.add('hide-at-bottom');
    } else {
      navbar.classList.remove('hide-at-bottom');
    }
    
    highlightCurrentSection();
  });

  // Smooth scroll for nav links
  const allNavLinks = [...navLinks, ...mobileNavLinks];
  
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      
      if (!targetId || targetId === '#') return;
      
      // Close mobile menu first
      if (mobileMenuButton.classList.contains('active')) {
        mobileMenuButton.classList.remove('active');
        mobileMenu.style.height = '0';
        mobileMenu.classList.remove('open');
      }

      // Use GSAP ScrollToPlugin for accurate scrolling even with pinned sections
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        gsap.to(window, {
          duration: 1,
          scrollTo: {
            y: targetId,
            offsetY: 70 // Navbar height offset
          },
          ease: "power2.inOut"
        });
      }
    });
  });

  // Highlight active section in navbar
  function highlightCurrentSection() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      
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
