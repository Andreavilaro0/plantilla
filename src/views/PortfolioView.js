import { PortfolioController } from '../controllers/PortfolioController.js';

const PortfolioView = () => {
  // Initialize PortfolioController after DOM is ready
  setTimeout(() => {
    const portfolioRoot = document.getElementById('portfolio');
    if (portfolioRoot) {
      const controller = new PortfolioController(portfolioRoot);
      controller.mount();
      console.log('✨ PortfolioController initialized - obras loaded');
      
      // Store reference for cleanup
      window.__portfolioController = controller;
    } else {
      console.warn('⚠️ Portfolio root element not found');
    }
  }, 100);

  return `
    <section id="portfolio" class="relative min-h-screen">
      <!-- Capa reservada para WebGL (paso posterior) -->
      <div class="absolute inset-0 -z-10 w-full h-full"></div>

      <div class="relative z-10">
        <div class="mx-auto max-w-[1280px] w-full px-6 py-10">
          <h2 class="text-sm font-medium tracking-wide opacity-80 mb-5">Obras</h2>

          <!-- Grid ancho (sin marco global) -->
          <div id="portfolio-grid" class="grid gap-5 w-full"></div>

          <!-- Estado vacío -->
          <div id="portfolio-empty" class="hidden p-10 text-center opacity-70">
            <p>No hay obras para mostrar.</p>
          </div>
        </div>
      </div>
    </section>
  `;
};

export default PortfolioView;

