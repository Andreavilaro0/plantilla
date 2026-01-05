import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import router from './router.js';
import { initNavbar, setActiveLink } from './ui/navbar.js';
import { initLiquidGradient } from './animations/liquid-gradient.js';

import { obras } from './data/obras.js';
import { Showcase } from './Experience/World/Showcase.js';
import { AboutController } from './controllers/AboutController.js';

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
  const liquidApp = initLiquidGradient();
  
  // Inicializar Showcase WebGL (portfolio showcase)
  if (window.initShowcase) {
    window.initShowcase(liquidApp);
  }
  
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

// About Controller - Global instance
let aboutController = null;

window.initAboutWindow = function() {
  console.log('🎨 Initializing About Section');

  // Destroy previous instance if exists
  if (aboutController) {
    aboutController.destroy();
  }

  // Create new instance
  aboutController = new AboutController();
  aboutController.mount();
};

// Cleanup About on route change
window.destroyAbout = function() {
  if (aboutController) {
    aboutController.destroy();
    aboutController = null;
  }
};

// ============================================
// Showcase Initialization Function
// ============================================
window.initShowcase = function(liquidApp) {
  console.log('🎨 Initializing Showcase System');
  
  // Wait for DOM to be ready
  setTimeout(() => {
    const ghostElements = document.querySelectorAll('.showcase-item');
    if (ghostElements.length === 0) {
      console.warn('⚠️ No showcase elements found, skipping Showcase init');
      return;
    }
    
    // Create Showcase instance
    const showcase = new Showcase(liquidApp);
    
    // Prepare project data from ghost elements
    const projects = Array.from(ghostElements).map((el, index) => ({
      imageSrc: el.dataset.imageSrc,
      title: el.dataset.title || `Project ${index + 1}`,
      aspectRatio: parseFloat(el.dataset.aspectRatio) || 1.5,
      layer: parseInt(el.dataset.layer) || 1
    }));
    
    // Initialize showcase
    showcase.init(projects);
    
    // Add to liquid gradient's update loop
    const originalUpdate = liquidApp.update.bind(liquidApp);
    liquidApp.update = function(delta) {
      originalUpdate(delta);
      showcase.update(delta);
    };
    
    // Add to resize handler
    const originalResize = liquidApp.onResize.bind(liquidApp);
    liquidApp.onResize = function() {
      originalResize();
      showcase.onResize();
    };
    
    // Store reference for cleanup
    window.showcase = showcase;
    
    console.log('✅ Showcase system initialized');
  }, 500); // Wait for router to render
};

console.log('✅ Portfolio - Arquitectura modular cargada');
