/**
 * Cards Animations - Set inicial + reveal
 * CRÍTICO: Anima .photo-card (wrapper), NO .photo-media (Tailwind hover)
 */
import { gsap } from 'gsap';

export function initCardsAnimations() {
  const cards = document.querySelectorAll('.photo-card');
  
  if (cards.length === 0) return;
  
  // Set inicial - estado antes de reveal
  gsap.set(cards, {
    opacity: 0,
    y: 50
  });
  
  // Las animaciones de reveal se manejan en scroll.js
  // Aquí solo configuramos hover micro-interactions para inner
  
  cards.forEach((card) => {
    const inner = card.querySelector('.photo-media');
    if (!inner) return;
    
    card.addEventListener('mouseenter', () => {
      // Animación sutil del wrapper (no conflicta con Tailwind del inner)
      gsap.to(card, {
        z: 50,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        z: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
}
