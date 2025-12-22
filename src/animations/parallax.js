/**
 * Parallax Mousemove con lerp (interpolación suave)
 */
import { gsap } from 'gsap';

let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

const LERP_FACTOR = 0.08; // Factor de interpolación (más bajo = más suave)

export function initParallaxMouse() {
  const galleryField = document.querySelector('#gallery-field');
  const cards = document.querySelectorAll('.photo-card');
  
  if (!galleryField || cards.length === 0) return;
  
  // Escuchar movimiento del mouse
  document.addEventListener('mousemove', (e) => {
    // Normalizar posición del mouse (-1 a 1)
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });
  
  // Loop de animación con requestAnimationFrame
  function animate() {
    // Lerp (interpolación lineal) para suavizar el movimiento
    currentX += (mouseX - currentX) * LERP_FACTOR;
    currentY += (mouseY - currentY) * LERP_FACTOR;
    
    // Aplicar parallax a cada card según su velocidad
    cards.forEach((card) => {
      const speed = parseFloat(card.dataset.parallaxSpeed) || 1;
      
      const moveX = currentX * speed * 20; // Multiplicador de intensidad
      const moveY = currentY * speed * 20;
      
      gsap.set(card, {
        x: moveX,
        y: `+=${moveY}`, // Suma al Y existente del scroll parallax
        force3D: true // Forzar aceleración 3D
      });
    });
    
    requestAnimationFrame(animate);
  }
  
  // Iniciar loop
  animate();
}
