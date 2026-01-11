import '@/style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Flip } from 'gsap/Flip';
import router from '@/core/router.js';
import { initNavbar, setActiveLink } from '@/ui/navbar/navbar.js';
import SmoothScroll from '@/utils/scroll/SmoothScroll.js';
import ThemeToggle from '@/utils/theme/ThemeToggle.js';
import { log } from '@/utils/logger.js';

// ============================================
// REGISTRO EXPLÍCITO DE PLUGINS
// ============================================
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Flip);

// Variables globales (para acceso en controladores)
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
window.Flip = Flip;

// ============================================
// INICIALIZACIÓN TEMPRANA - DOMContentLoaded
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  log(' DOM Content Loaded - Starting initialization');
  
  // Inicializar theme toggle lo antes posible para evitar flash
  const themeToggle = new ThemeToggle();
  themeToggle.init();
  window.themeToggle = themeToggle;
  
  // Inicializar navbar 
  initNavbar();
  
  // Inicializar smooth scrolling
  const smoothScroll = new SmoothScroll();
  smoothScroll.init();
  window.smoothScroll = smoothScroll;
  
  // Exponer setActiveLink globalmente para el router
  window.setNavbarActiveLink = setActiveLink;
  
  log('Componentes core inicializados');
});

// ============================================
// REFRESH FINAL - window.load
// ============================================
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
  log(' ScrollTrigger refreshed on window load');
});

log(' Portfolio - Arquitectura modular cargada');


