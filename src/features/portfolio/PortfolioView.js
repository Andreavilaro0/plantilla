/**
 * PortfolioView.js
 * Template HTML para portfolio estilo Hannah Miles
 * 
 * Estructura:
 * - Título gigante fijo "PORTFOLIO" (z-index: 1, detrás)
 * - Grid de fotos 4 columnas (z-index: 2, encima)
 */

export default function PortfolioView() {
  return `
    <section id="portfolio" class="portfolio-section" data-scroll-section>
      <!-- Título gigante de fondo (FIJO) -->
      <h1 class="bg-title" aria-hidden="true">PORTFOLIO</h1>
      
      <!-- Grid de fotografías -->
      <div class="photos-grid">
        <!-- Las fotos se insertan aquí dinámicamente por PortfolioController -->
      </div>
      
      <!-- Loading indicator para scroll infinito -->
      <div class="loading-indicator">
        <div class="spinner"></div>
        <span>Loading more photos...</span>
      </div>
      
      <!-- Mensaje de fin de contenido -->
      <div class="end-message">
        ✨ You've reached the end of the portfolio
      </div>
    </section>
  `
}
