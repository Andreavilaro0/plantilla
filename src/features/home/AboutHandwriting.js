/**
 * Bad Handwriting Effect
 * Based on CodePen: https://codepen.io/joshwerner/pen/JoGqRwY
 */

const FONTS = [
  'caveat',
  'cedarville-cursive',
  'indie-flower',
  'nothing-you-could-do',
  'oooh-baby',
  'reenie-beanie',
  'shadows-into-light'
];

// Certain fonts might not look good with specific letters (optional blacklist logic)
const BLACKLIST = {
  l: ['cedarville-cursive', 'oooh-baby', 'nothing-you-could-do']
};

function seededRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

/**
 * Wraps each letter of the element's text content in a span with a random handwriting font.
 * @param {HTMLElement} element - The target element containing the text.
 * @param {string} textContent - The text to render (optional, uses element text if null).
 * @param {number} seed - Random seed for consistent font distribution.
 */
export function initHandwritingEffect(element, textContent = null, seed = 12) {
  if (!element) return;
  
  const text = textContent || element.textContent.trim();
  element.innerHTML = '';
  
  const lastUsed = {};
  let currentSeed = seed;

  // Split by words to keep word breaks functioning, or just chars?
  // CodePen splits by char. However, strict char splitting breaks word wrapping if spaces are treated as chars in spans.
  // Standard way: split chars, but ensure spaces are preserved.
  
  // To handle line breaks correctly, we should wrap each word in a span (inline-block) or just use characters.
  // The CodePen loops "for (const char of str)".
  
  for (const char of text) {
    // Logic to pick a font
    const lowerChar = char.toLowerCase();
    let availableFonts = [...FONTS];

    if (BLACKLIST[lowerChar]) {
      availableFonts = availableFonts.filter(f => !BLACKLIST[lowerChar].includes(f));
    }

    if (lastUsed[lowerChar]) {
      availableFonts = availableFonts.filter(f => f !== lastUsed[lowerChar]);
    }
    
    // Safety check if runs out
    if (availableFonts.length === 0) availableFonts = [...FONTS];

    const fontIndex = Math.floor(seededRandom(currentSeed) * availableFonts.length);
    const font = availableFonts[fontIndex] || FONTS[0];
    lastUsed[lowerChar] = font;

    const span = document.createElement('span');
    span.className = font;
    span.textContent = char;
    element.appendChild(span);

    currentSeed++;
  }
}
