import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { log } from '@/utils/logger.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScroll - Wrapper para Lenis smooth scrolling
 * Implementa scroll suave con inercia similar a paul-factory.com
 */
export default class SmoothScroll {
  constructor() {
    this.lenis = null;
    this.rafId = null;
  }

  /**
   * Inicializar Lenis y conectar con GSAP ScrollTrigger
   */
  init() {
    // Configurar Lenis con settings similares a paul-factory
    this.lenis = new Lenis({
      duration: 1.2,        // Duración de la animación de scroll
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing suave
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,   // Sensibilidad de la rueda del mouse
      touchMultiplier: 2,   // Sensibilidad del touch
      infinite: false,
    });

    // Conectar Lenis con GSAP ScrollTrigger
    this.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    log('🎯 SmoothScroll initialized');
  }

  /**
   * Scroll suave a una posición o elemento
   * @param {number|string|HTMLElement} target - Posición (número), selector CSS o elemento
   * @param {Object} options - Opciones de scroll (offset, duration, etc.)
   */
  scrollTo(target, options = {}) {
    if (this.lenis) {
      this.lenis.scrollTo(target, options);
    }
  }

  /**
   * Destruir instancia y limpiar
   */
  destroy() {
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
