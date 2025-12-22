import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import router from './router.js';

// Importar módulos de animación
import { initHeroAnimations } from './animations/hero-monet.js';
import { initScrollAnimations } from './animations/scroll.js';
import { initCardsAnimations } from './animations/cards.js';
import { initParallaxMouse } from './animations/parallax.js';
import { initFlipModal } from './animations/flipModal.js';

// ============================================
// REGISTRO EXPLÍCITO DE PLUGINS
// ============================================
gsap.registerPlugin(ScrollTrigger);

// Variables globales
window.gsap = gsap;

// ============================================
// INICIALIZACIÓN SEGURA (window.load)
// ============================================
window.addEventListener('load', () => {
  console.log('✅ Todas las imágenes cargadas - Recalculando ScrollTrigger');
  ScrollTrigger.refresh();
});

// ============================================
// INIT ANIMATIONS - Orquestador principal
// ============================================
function initAnimations() {
  console.log('🎨 Inicializando animaciones modulares');
  
  // Fade-in general del contenedor
  const app = document.querySelector('#app');
  if (app) {
    gsap.fromTo(app,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power2.out' }
    );
  }
  
  // Inicializar módulos de animación en orden
  initHeroAnimations();
  initCardsAnimations();
  initScrollAnimations();
  initParallaxMouse();
  initFlipModal();
  
  // Esperar render completo antes de refrescar ScrollTrigger
  setTimeout(() => {
    ScrollTrigger.refresh();
    console.log('✅ ScrollTrigger refrescado');
  }, 100);
}

// ============================================
// Exponer globalmente para router
// ============================================
window.initAnimations = initAnimations;

console.log('✅ Immersive Gallery - Arquitectura modular cargada');
