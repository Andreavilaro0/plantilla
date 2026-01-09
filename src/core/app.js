import '@/style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import router from '@/core/router.js';
import { initNavbar, setActiveLink } from '@/ui/navbar/navbar.js';
import SmoothScroll from '@/utils/scroll/SmoothScroll.js';
import ThemeToggle from '@/utils/theme/ThemeToggle.js';

// ============================================
// REGISTRO EXPLÍCITO DE PLUGINS
// ============================================
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Variables globales
window.gsap = gsap;

// ============================================
// INICIALIZACIÓN SEGURA (window.load)
// ============================================
window.addEventListener('load', () => {

  ScrollTrigger.refresh();
  
  // Inicializar navbar (persistente en todas las vistas)
  initNavbar();
  
  // ============================================
  // PAUL FACTORY - NEW SYSTEMS
  // ============================================
  
  // Inicializar smooth scrolling
  const smoothScroll = new SmoothScroll();
  smoothScroll.init();
  window.smoothScroll = smoothScroll;
  
  // Inicializar theme toggle
  const themeToggle = new ThemeToggle();
  themeToggle.init();
  window.themeToggle = themeToggle;
  
  console.log('✅ Paul Factory systems initialized');
  
  // Exponer setActiveLink globalmente para el router
  window.setNavbarActiveLink = setActiveLink;
});

console.log('✅ Portfolio - Arquitectura modular cargada');


