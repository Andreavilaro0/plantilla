import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

/**
 * TextReveal - Animación de revelación de texto estilo paul-factory
 * Los caracteres/palabras aparecen con fade-in + slide-up al entrar en viewport
 */
export default class TextReveal {
  constructor() {
    this.instances = [];
  }

  /**
   * Aplicar animación de reveal a un elemento
   * @param {string|HTMLElement} target - Selector CSS o elemento
   * @param {Object} options - Opciones de animación
   */
  apply(target, options = {}) {
    const defaults = {
      splitBy: 'words',           // 'chars', 'words', 'lines'
      y: 20,                      // Offset inicial vertical
      opacity: 0,                 // Opacidad inicial
      duration: 0.8,              // Duración de la animación
      stagger: 0.02,              // Delay entre elementos
      ease: 'power3.out',         // Easing
      start: 'top 80%',           // Trigger del ScrollTrigger
      triggerOnce: true,          // Solo animar una vez
    };

    const settings = { ...defaults, ...options };

    const elements = typeof target === 'string' 
      ? document.querySelectorAll(target) 
      : [target];

    elements.forEach((element) => {
      if (!element) return;

      // Split text en chars/words/lines
      const split = new SplitType(element, { types: settings.splitBy });
      
      // Obtener los elementos a animar
      let targets;
      if (settings.splitBy === 'chars') {
        targets = split.chars;
      } else if (settings.splitBy === 'words') {
        targets = split.words;
      } else {
        targets = split.lines;
      }

      if (!targets || targets.length === 0) return;

      // Configurar estado inicial
      gsap.set(targets, {
        y: settings.y,
        opacity: settings.opacity,
      });

      // Crear animación con ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: settings.start,
          once: settings.triggerOnce,
        },
      });

      tl.to(targets, {
        y: 0,
        opacity: 1,
        duration: settings.duration,
        stagger: settings.stagger,
        ease: settings.ease,
      });

      // Guardar referencia para cleanup
      this.instances.push({
        element,
        split,
        timeline: tl,
      });
    });
  }

  /**
   * Limpiar todas las instancias
   */
  destroy() {
    this.instances.forEach(({ split, timeline }) => {
      if (timeline) timeline.kill();
      if (split) split.revert();
    });
    this.instances = [];
  }
}
