/**
 * Inline SVG Icons for About Section
 * Pixelated, minimal style icons inspired by Clarisse Michard
 */

export const InlineIcons = {
  sun: `
    <svg class="inline-icon sun-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="4" fill="currentColor"/>
      <path d="M12 2v2M12 20v2M22 12h-2M4 12H2M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41M19.07 19.07l-1.41-1.41M6.34 6.34L4.93 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
  
  heart: `
    <svg class="inline-icon heart-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  `,
  
  strong: `
    <svg class="inline-icon strong-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 14c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z" fill="currentColor"/>
      <path d="M18 7v6a6 6 0 11-12 0V7h3v6a3 3 0 106 0V7h3z" stroke="currentColor" stroke-width="2" fill="currentColor"/>
      <rect x="8" y="3" width="8" height="4" rx="1" fill="currentColor"/>
    </svg>
  `,
  
  smile: `
    <svg class="inline-icon smile-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
      <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor"/>
      <circle cx="15.5" cy="9.5" r="1.5" fill="currentColor"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  
  globe: `
    <svg class="inline-icon globe-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" stroke-width="2"/>
    </svg>
  `,
  
  camera: `
    <svg class="inline-icon camera-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
      <circle cx="12" cy="13" r="3" stroke="currentColor" stroke-width="2"/>
      <path d="M7 6V4h10v2" stroke="currentColor" stroke-width="2"/>
      <circle cx="18" cy="9" r="1" fill="currentColor"/>
    </svg>
  `
};

/**
 * Insert an inline icon into text
 * @param {string} iconName - Name of the icon from InlineIcons
 * @returns {string} SVG HTML string
 */
export function getInlineIcon(iconName) {
  return InlineIcons[iconName] || '';
}

/**
 * Apply icons to a text element
 * Usage: applyInlineIcons('.about-text', { 'photographer': 'camera', 'love': 'heart' })
 * @param {string} selector - CSS selector for target element
 * @param {Object} replacements - Map of words to icon names
 */
export function applyInlineIcons(selector, replacements) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    let html = element.innerHTML;
    
    Object.entries(replacements).forEach(([word, iconName]) => {
      const icon = getInlineIcon(iconName);
      if (icon) {
        // Replace word with icon (case-insensitive)
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        html = html.replace(regex, `<span class="icon-wrapper">${icon}</span>`);
      }
    });
    
    element.innerHTML = html;
  });
}
