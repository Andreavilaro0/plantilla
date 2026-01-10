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
      
      <!-- Overlay para focus mode (inicialmente oculto) -->
      <div class="focus-overlay"></div>
      
      <!-- Contenedor de thumbnails (inicialmente vacío) -->
      <div class="thumbnails-container"></div>
    </section>
  `
}
