/**
 * AboutController
 * Gestiona la animación de la palabra cambiante en la sección About
 */

import gsap from 'gsap';
import { log } from '@/utils/logger.js';

export class AboutController {
  constructor() {
    this.palabras = ['levitar', 'flotar', 'suspender', 'aligerar', 'despegar', 'elevar'];
    this.currentIndex = 0;
    this.element = null;
    this.intervalId = null;
    this.prefersReducedMotion = false;
  }

  mount() {
    // Verificar preferencia de movimiento reducido
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Obtener elemento
    this.element = document.getElementById('palabra-cambiante');

    if (!this.element) {
      console.warn('[AboutController] Elemento #palabra-cambiante no encontrado');
      return;
    }

    // Si reduced-motion está activo, no animar
    if (this.prefersReducedMotion) {
      this.element.textContent = this.palabras[0];
      this.element.setAttribute('data-color', '0');
      log('[AboutController] Animación desactivada (prefers-reduced-motion)');
      return;
    }

    // Iniciar ciclo de palabras
    this.startCycle();
    log('[AboutController] ✅ Ciclo de palabras iniciado');
  }

  startCycle() {
    // Cambiar palabra cada 2.5 segundos
    this.intervalId = setInterval(() => {
      this.changePalabra();
    }, 2500);
  }

  changePalabra() {
    if (!this.element) return;

    // Añadir clase de transición (fade out)
    this.element.classList.add('transitioning');

    // Después de la transición, cambiar texto y color
    setTimeout(() => {
      // Avanzar al siguiente índice
      this.currentIndex = (this.currentIndex + 1) % this.palabras.length;

      // Actualizar texto
      this.element.textContent = this.palabras[this.currentIndex];

      // Actualizar color (ciclar entre 4 colores)
      const colorIndex = this.currentIndex % 4;
      this.element.setAttribute('data-color', colorIndex);

      // Remover clase de transición (fade in)
      requestAnimationFrame(() => {
        this.element.classList.remove('transitioning');
      });
    }, 400); // Duración de la transición CSS
  }

  destroy() {
    // Limpiar intervalo
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Limpiar referencia
    this.element = null;

    log('[AboutController] ✅ Cleanup completado');
  }
}
