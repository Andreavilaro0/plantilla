import gsap from 'gsap';
import { log } from '@/utils/logger.js';

/**
 * Magnetic Letter Effect for Hero Title
 * Letters follow cursor with smooth physics-based animation
 * Using GSAP for performance and elegance
 */

export function initPixelRevealEffect() {
  const titleWords = document.querySelectorAll('.hero-title .word');
  
  titleWords.forEach((word) => {
    // Split text into individual letters
    const letters = splitTextIntoLetters(word);
    
    // Add magnetic hover effect
    word.addEventListener('mousemove', (e) => {
      handleMagneticMove(e, word, letters);
    });
    
    // Reset on mouse leave with elastic bounce
    word.addEventListener('mouseleave', () => {
      resetLetters(letters);
    });
  });
  
  log('✨ Magnetic Letter Effect initialized');
}

/**
 * Split word text into individual letter spans
 */
function splitTextIntoLetters(wordElement) {
  const text = wordElement.textContent;
  wordElement.innerHTML = '';
  
  const letters = [];
  
  for (let i = 0; i < text.length; i++) {
    const letter = document.createElement('span');
    letter.className = 'magnetic-letter';
    letter.textContent = text[i];
    letter.style.display = 'inline-block';
    letter.style.position = 'relative';
    wordElement.appendChild(letter);
    letters.push(letter);
  }
  
  return letters;
}

/**
 * Handle magnetic movement - letters move toward cursor
 */
function handleMagneticMove(event, wordElement, letters) {
  const rect = wordElement.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
  letters.forEach((letter) => {
    const letterRect = letter.getBoundingClientRect();
    const letterCenterX = letterRect.left + letterRect.width / 2 - rect.left;
    const letterCenterY = letterRect.top + letterRect.height / 2 - rect.top;
    
    // Calculate distance from mouse to letter center
    const deltaX = mouseX - letterCenterX;
    const deltaY = mouseY - letterCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Magnetic pull strength (inversely proportional to distance)
    const magneticRadius = 150;
    const strength = Math.max(0, 1 - distance / magneticRadius);
    
    // Calculate movement (letters move toward cursor)
    const moveX = deltaX * strength * 0.3;
    const moveY = deltaY * strength * 0.3;
    
    // Smooth GSAP animation with elastic ease
    gsap.to(letter, {
      x: moveX,
      y: moveY,
      duration: 0.5,
      ease: 'power2.out'
    });
    
    // Add subtle scale on proximity
    const scale = 1 + strength * 0.1;
    gsap.to(letter, {
      scale: scale,
      duration: 0.3,
      ease: 'back.out(1.2)'
    });
  });
}

/**
 * Reset all letters to original position with bounce
 */
function resetLetters(letters) {
  letters.forEach((letter, index) => {
    gsap.to(letter, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.8,
      delay: index * 0.02, // Stagger for wave effect
      ease: 'elastic.out(1, 0.5)'
    });
  });
}

/**
 * Cleanup function
 */
export function destroyPixelRevealEffect() {
  const letters = document.querySelectorAll('.magnetic-letter');
  letters.forEach(letter => {
    gsap.killTweensOf(letter);
  });
  log('🧹 Magnetic Letter Effect cleaned up');
}
