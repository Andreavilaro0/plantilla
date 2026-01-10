import { PortfolioController } from '@/features/portfolio/PortfolioController.js';
import { log } from '@/utils/logger.js';

const PortfolioView = () => {
  // Initialize PortfolioController after DOM is ready
  setTimeout(() => {
    const portfolioRoot = document.getElementById('portfolio');
    if (portfolioRoot) {
      const controller = new PortfolioController(portfolioRoot);
      controller.mount();
      log('✨ PortfolioController initialized - obras loaded');
      
      // Store reference for cleanup
      window.__portfolioController = controller;
    } else {
      console.warn('⚠️ Portfolio root element not found');
    }
  }, 100);

  return `
    <section id="portfolio" class="portfolio">
      <!-- SPACER: Create scroll distance before reveal -->
      <div class="portfolio-stage-spacer"></div>

      <!-- STAGE: The pinned area with background word + grid -->
      <div class="portfolio-stage">
        <!-- BACKGROUND WORD: Gigante, detrás, editorial -->
        <div class="portfolio-bgword" aria-hidden="true">IMPRESSIONS</div>

        <!-- GRID CONTAINER: Editorial layout -->
        <div id="portfolio-grid" class="portfolio-grid"></div>

        <!-- Estado vacío -->
        <div id="portfolio-empty" class="portfolio-empty hidden">
          <p>No hay obras para mostrar.</p>
        </div>
      </div>
    </section>
  `;
};

export default PortfolioView;

