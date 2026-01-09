import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ParallaxController - Controla efectos parallax en elementos
 * Elementos de fondo se mueven a diferentes velocidades que el scroll
 */
export default class ParallaxController {
  constructor() {
    this.instances = [];
  }

  /**
   * Aplicar efecto parallax a un elemento
   * @param {string|HTMLElement} target - Selector CSS o elemento
   * @param {Object} options - Opciones de parallax
   */
  apply(target, options = {}) {
    const defaults = {
      speed: 0.5,              // Velocidad del parallax (0-1, menor = más lento)
      direction: 'vertical',   // 'vertical' o 'horizontal'
      start: 'top bottom',     // Inicio del ScrollTrigger
      end: 'bottom top',       // Fin del ScrollTrigger
      scrub: true,             // Sincronizar con scroll
    };

    const settings = { ...defaults, ...options };

    const elements = typeof target === 'string' 
      ? document.querySelectorAll(target) 
      : [target];

    elements.forEach((element) => {
      if (!element) return;

      // Calcular distancia de movimiento
      const movement = settings.direction === 'vertical' 
        ? { y: `${settings.speed * 100}%` }
        : { x: `${settings.speed * 100}%` };

      // Crear animación con ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: settings.start,
          end: settings.end,
          scrub: settings.scrub,
        },
      });

      tl.fromTo(
        element,
        { ...movement, force3D: true }, // Estado inicial (invertido)
        { 
          y: settings.direction === 'vertical' ? `-${settings.speed * 100}%` : 0,
          x: settings.direction === 'horizontal' ? `-${settings.speed * 100}%` : 0,
          ease: 'none',
          force3D: true,
        }
      );

      // Guardar referencia
      this.instances.push({
        element,
        timeline: tl,
      });
    });
  }

  /**
   * Limpiar todas las instancias
   */
  destroy() {
    this.instances.forEach(({ timeline }) => {
      if (timeline) timeline.kill();
    });
    this.instances = [];
  }
}
