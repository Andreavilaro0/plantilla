import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import router from './router.js';
import { initNavbar, setActiveLink } from './ui/navbar.js';
import { initLiquidGradient } from './animations/liquid-gradient.js';

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
  
  // Inicializar fondo Liquid Gradient
  initLiquidGradient();
  
  // Exponer setActiveLink globalmente para el router
  window.setNavbarActiveLink = setActiveLink;
});

// ============================================
// INIT ANIMATIONS - Simplificado
// ============================================
function initAnimations() {

  
  // Fade-in general del contenedor
  const app = document.querySelector('#app');
  if (app) {
    gsap.fromTo(app,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power2.out' }
    );
  }
  
  // Refrescar ScrollTrigger después del render
  setTimeout(() => {
    ScrollTrigger.refresh();

  }, 100);
}

// ============================================
// Exponer globalmente para router
// ============================================
window.initAnimations = initAnimations;

console.log('✅ Portfolio - Arquitectura modular cargada');
