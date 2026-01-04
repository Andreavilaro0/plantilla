import { obras } from '../data/obras.js';
import { bindEnterGalleryButton } from '../transitions/enterGallery.js';
import { initTitleAnimations } from '../animations/hero-scroll-title.js';
import VanillaTilt from '../lib/vanilla-tilt.js';
import { PortfolioController } from '../controllers/PortfolioController.js';



/**
 * Generate descriptive ALT text for artwork images
 * @param {Object} obra - Artwork object with titulo, categoria, year
 * @returns {string} Descriptive ALT text
 */
function generateAltText(obra) {
  const categoryDescriptions = {
    'Paisaje': 'Fotografía de paisaje',
    'Abstracto': 'Composición abstracta',
    'Urbano': 'Fotografía urbana',
    'Interior': 'Fotografía de interior',
    'Retrato': 'Retrato fotográfico',
    'Costero': 'Fotografía costera',
    'Arquitectura': 'Fotografía de arquitectura'
  };
  
  const baseDesc = categoryDescriptions[obra.categoria] || 'Fotografía';
  return `${baseDesc} titulada "${obra.titulo}" del año ${obra.year}`;
}

export default function HomeView() {
  // ============================================
  // Hero Section - Clean title + CTAs only
  // ============================================

  const template = `
    <div class="relative w-full min-h-screen bg-transparent text-white">
      
      <!-- CINEMATIC TRANSITION CURTAIN -->
      <div id="transition-curtain"></div>

      <!-- ========================================== -->
      <!-- HERO SECTION -->
      <!-- ========================================== -->
      <section id="hero" class="relative overflow-hidden" style="min-height: 100vh;">
        <!-- Background with glow -->
        <div class="hero-bg absolute inset-0 bg-transparent"></div>

        <!-- Title + Subtitle + CTA (IN FRONT) -->
        <div class="hero-text relative z-20 flex flex-col justify-center" style="min-height: 100vh; box-sizing: border-box;">
            <!-- Editorial Aggressive Layout -->
            <!-- MANDATORY HERO TITLE SHELL -->
            <div class="hero-title-shell">
              <h1 id="hero-title" class="hero-title">
                <span class="title-mask">
                  <span class="title-line line-1 monet-line">WORK</span>
                </span>
                <span class="title-mask">
                  <span class="title-line line-2 impressions-line">IMPRESSIONS</span>
                </span>
              </h1>
            </div>

          <!-- CTA Row: Two Buttons with Accessibility -->
          <div class="hero-cta-row flex items-center justify-center gap-6 mt-12 pointer-events-auto">
            <button 
              class="hero-cta hero-enter rounded-full border border-white/30 px-8 py-3 text-sm text-white/90 tracking-widest hover:bg-white/10 transition-all duration-300"
              aria-label="Ver galería de fotografías"
              role="button"
              tabindex="0">
              VER GALERÍA
            </button>
            <a 
              href="/contact" 
              data-link
              class="hero-cta rounded-full border border-blue-500/40 bg-blue-500/10 px-8 py-3 text-sm text-white/90 tracking-widest hover:bg-blue-500/20 transition-all duration-300"
              aria-label="Reservar sesión fotográfica"
              role="button"
              tabindex="0">
              RESERVAR SESIÓN
            </a>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- ========================================== -->
      <!-- SECTIONS - Colin Moy Style -->
      <!-- ========================================== -->
      <main class="sections-container bg-transparent">
        
        <!-- ABOUT SECTION -->
        <section id="about" class="section-block relative min-h-screen flex items-center justify-center bg-transparent cursor-pointer hover:bg-white/5 transition-colors duration-300">
          <div class="text-center px-8">
            <h2 class="section-title text-8xl md:text-9xl font-bold uppercase tracking-tighter text-white">
              ABOUT
            </h2>
          </div>
        </section>


        <!-- PORTFOLIO SECTION - PASO 2: Individual frames per artwork, NO global frame -->
        <section id="portfolio" class="section-block relative min-h-screen bg-transparent py-20 px-6">
          <!-- Background layer (reserved for PASO 3 WebGL) -->
          <div class="absolute inset-0 -z-10 w-full h-full"></div>

          <!-- Content Overlay -->
          <div class="relative z-10">
            <div class="mx-auto max-w-[1280px] w-full px-6 py-10">
              <h2 class="text-sm font-medium tracking-wide opacity-80 mb-5 text-white">Obras</h2>

              <!-- Grid ancho (sin marco global) -->
              <div id="portfolio-grid" class="grid gap-5 w-full"></div>

              <!-- Estado vacío -->
              <div id="portfolio-empty" class="hidden p-10 text-center opacity-70">
                <p>No hay obras para mostrar.</p>
              </div>
            </div>
          </div>

          <!-- Next Section Arrow -->
          <div class="relative z-10 w-full flex justify-center py-20 pointer-events-auto">
            <a href="#services" class="scroll-arrow group" aria-label="Ir a Servicios">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" class="text-white/70 group-hover:text-white transition-colors duration-300 animate-bounce">
                <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </section>

        <!-- SERVICES SECTION - VanillaTilt Cards -->
        <section id="services" class="section-block relative min-h-screen flex items-center justify-center bg-transparent py-20 px-6">
          <div class="w-full max-w-7xl mx-auto">
            <h2 class="services-title">Our Services</h2>
            <div class="services-container">
              <div class="tilt-card">
                <div class="card-content">
                  <h2 class="card-number">01</h2>
                  <h3 class="card-title">Web Design</h3>
                  <p class="card-description">Creating stunning, responsive websites that captivate your audience and deliver exceptional user experiences.</p>
                  <a href="#" class="card-link">Read More</a>
                </div>
              </div>
              
              <div class="tilt-card">
                <div class="card-content">
                  <h2 class="card-number">02</h2>
                  <h3 class="card-title">App Design</h3>
                  <p class="card-description">Designing intuitive mobile applications that seamlessly blend aesthetics with functionality for modern users.</p>
                  <a href="#" class="card-link">Read More</a>
                </div>
              </div>
              
              <div class="tilt-card">
                <div class="card-content">
                  <h2 class="card-number">03</h2>
                  <h3 class="card-title">Graphic Design</h3>
                  <p class="card-description">Crafting compelling visual identities and branded materials that make your business stand out from the crowd.</p>
                  <a href="#" class="card-link">Read More</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- CONTACT SECTION -->
        <section id="contact" class="section-block relative min-h-screen flex items-center justify-center bg-transparent cursor-pointer hover:bg-white/5 transition-colors duration-300">
          <div class="text-center px-8">
            <h2 class="section-title text-8xl md:text-9xl font-bold uppercase tracking-tighter text-white">
              C&#9679;NTACT
            </h2>
            <div class="mt-12">
              <button class="px-12 py-4 bg-white text-black rounded-full text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300">
                ¿CÓMO PUEDO AYUDAR?
              </button>
            </div>
          </div>
        </section>

      </main>


    </div>
  `;
  
  // ============================================
  // Bind buttons e images después del render
  // ============================================
  setTimeout(() => {
    const app = document.querySelector('#app');
    if (app) {
      // Initialize interactions
      bindEnterGalleryButton(app);
      initTitleAnimations(); // Init MANDATORY advanced title animations
      
      // Initialize VanillaTilt on service cards
      const cards = document.querySelectorAll('.tilt-card');
      if (cards.length > 0) {
        VanillaTilt.init(cards, {
          max: 25,
          speed: 400,
          glare: true,
          'max-glare': 1,
        });
        console.log('✨ VanillaTilt initialized on', cards.length, 'cards (HomeView)');
      }
      
      // Initialize Portfolio Controller (PASO 2)
      const portfolioSection = document.getElementById('portfolio');
      if (portfolioSection) {
        const portfolioController = new PortfolioController(portfolioSection);
        portfolioController.mount();
        
        // Store controller reference for cleanup
        window.portfolioController = portfolioController;
      }
    }
  }, 100);
  
  return template;
}
