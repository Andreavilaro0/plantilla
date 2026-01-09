/**
 * Footer Component
 * Inspired by Paul Factory footer with social links and footer navigation
 */

export function FooterView() {
  return `
    <footer id="footer" class="footer-section">
      <div class="footer-content">
        <!-- Social Links (Left) -->
        <div class="footer-socials">
          <a href="https://instagram.com/" class="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          
          <a href="https://linkedin.com/" class="social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          
          <a href="https://dribbble.com/" class="social-link" aria-label="Dribbble" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path>
            </svg>
          </a>
        </div>
        
        <!-- Footer Links (Right) -->
        <div class="footer-links">
          <a href="#" class="footer-link">Legal information</a>
          <a href="#" class="footer-link">Privacy Policy</a>
        </div>
      </div>
      
      <!-- Copyright Text -->
      <p class="footer-copyright">
        © ${new Date().getFullYear()} All rights reserved. Design & Code by Andrea Ávila.
      </p>
    </footer>
  `;
}
