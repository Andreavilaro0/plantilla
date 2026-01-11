/**
 * AboutHandwriting.js
 * Implements a "bad handwriting" effect by wrapping each character in a span
 * and applying a random font from a predefined list.
 */

const HANDWRITING_FONTS = [
  'Caveat',
  'Cedarville Cursive',
  'Indie Flower',
  'Nothing You Could Do',
  'Oooh Baby',
  'Reenie Beanie',
  'Shadows Into Light'
];

/**
 * Seeded random for consistent font assignment
 * @param {string} str 
 * @returns {number}
 */
function getSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Initializes the handwriting effect on a target element
 * @param {HTMLElement} element 
 * @param {Object} options 
 */
export function initHandwritingEffect(element, options = {}) {
  if (!element) return;

  const text = element.textContent;
  const seed = getSeed(text);
  
  element.innerHTML = '';
  
  // Create a fragment for better performance
  const fragment = document.createDocumentFragment();
  
  [...text].forEach((char, index) => {
    const span = document.createElement('span');
    span.textContent = char;
    
    if (char !== ' ') {
      // Pick a random font based on index and seed
      const fontIndex = (seed + index) % HANDWRITING_FONTS.length;
      span.style.fontFamily = `"${HANDWRITING_FONTS[fontIndex]}", cursive`;
      
      // Random subtle rotation
      const rotation = ((seed + index) % 7) - 3; // -3 to 3 degrees
      span.style.display = 'inline-block';
      span.style.transform = `rotate(${rotation}deg)`;
      
      // Random subtle font size variation
      const sizeOffset = ((seed + index) % 4) - 2; // -2 to 2 px
      span.style.fontSize = `calc(1em + ${sizeOffset}px)`;
    } else {
      span.style.marginRight = '0.25em';
    }
    
    fragment.appendChild(span);
  });
  
  element.appendChild(fragment);
}
