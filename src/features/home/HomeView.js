import { initTitleAnimations } from '@/animations/text/hero-scroll-title.js';
import { initPixelRevealEffect } from '@/animations/scroll/pixel-reveal.js';
import { initAboutAnimations } from '@/animations/scroll/about-scroll.js';
import { initBounceEntrance } from '@/animations/scroll/bounce-entrance.js';
import { TestimonialCarousel } from '@/animations/carousel/testimonial-carousel.js';
import VanillaTilt from '@/lib/vanilla-tilt.js';
import { PortfolioController } from '@/features/portfolio/PortfolioController.js';
// PortfolioBackgroundText removed
import { initPortfolioEntrance } from '@/animations/scroll/portfolio-entrance.js';
import { InlineIcons } from '@/ui/icons/InlineIcons.js';
import { TestimonialsView } from '@/features/shared/TestimonialsView.js';
import { FooterView } from '@/features/shared/FooterView.js';
import { ContactModal } from '@/ui/modals/ContactModal.js';
import { initHandwritingEffect } from '@/features/home/AboutHandwriting.js';



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
  // Hero Section - Nivedha Inspired Design
  // ============================================

  const template = `
    <div class="relative w-full min-h-screen">
      
      <!-- ========================================== -->
      <!-- HERO SECTION - HUD Layout (Clarisse Inspired) -->
      <!-- ========================================== -->
      <section id="hero">
        <!-- HUD Corner Elements -->
        <div class="hud-corners">
          <span class="hud-year">2025</span>
          <span class="hud-tag">PHOTOGRAPHY</span>
          <span class="hud-projects">15+<br>PROJECTS<br>2024</span>
          <span class="hud-status">AVAILABLE</span>
        </div>

        <!-- Central Content -->
        <div class="hero-center">
          <h1 class="hero-title">
            <span class="word">CAPTURING</span>
            <span class="word">MOMENTS</span>
          </h1>
          <p class="hero-subtitle">Visual Storyteller & Photographer</p>
        </div>

        <!-- Side Info Block -->
        <div class="hero-info">
          <h3>EDITORIAL &<br>URBAN PHOTOGRAPHY</h3>
          <p>Contemporary photographer specialized in capturing moments and telling visual stories through the lens.</p>
          <button class="discover-btn" onclick="document.getElementById('portfolio').scrollIntoView({behavior: 'smooth'})">
            Discover Work →
          </button>
        </div>

        <!-- Social Links -->
        <div class="hero-socials">
          <a href="#" aria-label="Instagram">Instagram</a>
          <a href="#" aria-label="Dribbble">Dribbble</a>
          <a href="#" aria-label="LinkedIn">LinkedIn</a>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- ABOUT SECTION - Blob Image Effect -->
      <!-- ========================================== -->
      <section id="about">
        <div class="about-container">
          
          <!-- SVG con efecto blob -->
          <div class="about-blob-wrapper">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="about-blob-svg" aria-labelledby="aboutTitle">
              <title id="aboutTitle">Imagen de perfil</title>
              
              <!-- Imagen con clip-path -->
              <image 
                href="${import.meta.env.BASE_URL}assets/about-profile.jpg"
                width="200" 
                height="200"
                preserveAspectRatio="xMidYMid slice"
                clip-path="url(#blobClip)"
              />
              
              <!-- Clip path para la forma blob -->
              <clipPath id="blobClip">
                <path d="M43.1,-68.5C56.2,-58.6,67.5,-47.3,72.3,-33.9C77.2,-20.5,75.5,-4.9,74.2,11.3C72.9,27.6,71.9,44.5,63.8,57.2C55.7,69.8,40.6,78.2,25.5,79.2C10.4,80.1,-4.7,73.6,-20.9,69.6C-37.1,65.5,-54.5,63.9,-66,54.8C-77.5,45.8,-83.2,29.3,-85.7,12.3C-88.3,-4.8,-87.7,-22.3,-79.6,-34.8C-71.5,-47.3,-55.8,-54.9,-41.3,-64.2C-26.7,-73.6,-13.4,-84.7,0.8,-86C15,-87.2,29.9,-78.5,43.1,-68.5Z"
                      transform="translate(100 100)"/>
              </clipPath>

              <!-- Path invisible para el texto -->
              <path
                id="textPath"
                d="M43.1,-68.5C56.2,-58.6,67.5,-47.3,72.3,-33.9C77.2,-20.5,75.5,-4.9,74.2,11.3C72.9,27.6,71.9,44.5,63.8,57.2C55.7,69.8,40.6,78.2,25.5,79.2C10.4,80.1,-4.7,73.6,-20.9,69.6C-37.1,65.5,-54.5,63.9,-66,54.8C-77.5,45.8,-83.2,29.3,-85.7,12.3C-88.3,-4.8,-87.7,-22.3,-79.6,-34.8C-71.5,-47.3,-55.8,-54.9,-41.3,-64.2C-26.7,-73.6,-13.4,-84.7,0.8,-86C15,-87.2,29.9,-78.5,43.1,-68.5Z"
                transform="translate(100 100)"
                fill="none" 
                stroke="none"
                pathLength="100"
              />

              <!-- Texto animado que gira alrededor -->
              <text class="blob-text-content">
                <textPath href="#textPath" startOffset="0%">
                  ★ CREATIVE DESIGNER ★ VISUAL ARTIST ★ CREATIVE DESIGNER ★ VISUAL ARTIST ★
                  <animate attributeName="startOffset" from="0%" to="100%" dur="20s" repeatCount="indefinite" />
                </textPath>
                <textPath href="#textPath" startOffset="100%">
                  ★ CREATIVE DESIGNER ★ VISUAL ARTIST ★ CREATIVE DESIGNER ★ VISUAL ARTIST ★
                  <animate attributeName="startOffset" from="-100%" to="0%" dur="20s" repeatCount="indefinite" />
                </textPath>
              </text>
            </svg>
          </div>

          <!-- Texto de descripción -->
          <!-- Texto de descripción (BAD HANDWRITING EFFECT) -->
          <div class="about-text-content">
            <div id="handwriting-target" class="handwriting-container">
              <p>Life is full of small moments that shape who we are. Each day brings new chances to learn, connect, and grow. Even simple things like a quiet morning, a kind word, or a shared smile can leave a lasting mark. By paying attention to these moments, we find meaning in the ordinary.</p>
            </div>
          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- PORTFOLIO SECTION - Postage Stamps -->
      <!-- ========================================== -->
      <!-- ========================================== -->
      <!-- PORTFOLIO SECTION - Editorial Stage -->
      <!-- ========================================== -->
      <section id="portfolio" class="portfolio">
        <!-- Scroll Spacer (allows scrolling "into" the stage) -->
        <div class="portfolio-stage-spacer"></div>
        
        <!-- The Stage (Pinned area) -->
        <div class="portfolio-stage">
          <div class="portfolio-bgword" aria-hidden="true">IMPRESSIONS</div>
          
          <!-- Grid -->
          <div id="portfolio-grid" class="portfolio-grid"></div>
          
          <!-- Empty State -->
          <div id="portfolio-empty" class="hidden portfolio-empty">
            <p>No hay obras para mostrar.</p>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- TESTIMONIALS SECTION - Paul Factory Inspired -->
      <!-- ========================================== -->
      ${TestimonialsView()}

      <!-- ========================================== -->
      <!-- SERVICES SECTION -->
      <!-- ========================================== -->
      <section id="services" class="services-section" data-bounce-section>
        <h2 class="services-section-title">What I Do</h2>
        <div class="services-grid">
          <div class="service-card tilt-card">
            <div class="card-content">
              <h2 class="card-number">01</h2>
              <h3 class="card-title">Photography</h3>
              <p class="card-description">Professional photography services for editorial, commercial, and personal projects.</p>
            </div>
          </div>
          
          <div class="service-card tilt-card">
            <div class="card-content">
              <h2 class="card-number">02</h2>
              <h3 class="card-title">Art Direction</h3>
              <p class="card-description">Creative art direction for brands, campaigns, and visual storytelling projects.</p>
            </div>
          </div>
          
          <div class="service-card tilt-card">
            <div class="card-content">
              <h2 class="card-number">03</h2>
              <h3 class="card-title">Workshops</h3>
              <p class="card-description">Photography workshops and mentoring for aspiring visual artists and creators.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- CTA SECTION - Dark Card -->
      <!-- ========================================== -->
      <section id="cta" class="cta-section" data-bounce-section>
        <div class="cta-card">
          <h2 class="cta-title">
            <span class="word">DO</span>
            <span class="word">YOU</span>
            <span class="word">HAVE</span>
            <span class="word">AN</span>
            <span class="word">AWESOME</span>
            <span class="word">PROJECT?</span>
          </h2>
          <button class="cta-button" onclick="window.contactModal.open()">
            CONTACT ME
          </button>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- FOOTER - Paul Factory Inspired -->
      <!-- ========================================== -->
      ${FooterView()}

    </main>


    </div>
  `;
  
  // ============================================
  // SYNCHRONOUS INITIALIZATION (Before DOM mount)
  // ============================================
  
  // Initialize Bad Handwriting Effect immediately against the disconnected DOM
  try {
    const hwTarget = container.querySelector('#handwriting-target p');
    if (hwTarget) {
       console.log('[HomeView] Initializing handwriting synchronously');
       // Clean initialization
       initHandwritingEffect(hwTarget, null);
       hwTarget.style.opacity = '1';
       hwTarget.classList.remove('hidden');
    }
  } catch (e) {
    console.error('[HomeView] Sync init failed:', e);
  }

  // ============================================
  // ASYNCHRONOUS INITIALIZATION (After DOM mount)
  // ============================================
  setTimeout(() => {
     const app = document.querySelector('#app');
     if (app) {
       // Initialize interactions
       initTitleAnimations(); 
       
       // ... existing async inits ...
      
      // Initialize pixel reveal hover effect (after DOM animations complete)
      setTimeout(() => {
        initPixelRevealEffect();
      }, 2000); // Wait for entrance animations
      
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
      
      // Initialize Portfolio Controller with Hannah Miles style
      const portfolioSection = document.getElementById('portfolio');
      if (portfolioSection) {
        // Initialize Portfolio Controller
        const portfolioController = new PortfolioController(portfolioSection);
        portfolioController.mount();
        
        // Initialize Background Text Layer - "IMPRESSIONS"
        // Background Text now part of HTML structure
        // const bgText = new PortfolioBackgroundText(portfolioSection, "IMPRESSIONS");
        // bgText.mount();
        
        // Initialize Portfolio Entrance Animation (NOW HANDLED BY PortfolioController)
        // const portfolioGrid = document.getElementById('portfolio-grid');
        // if (portfolioGrid) {
        //   const cleanupPortfolioAnim = initPortfolioEntrance(portfolioGrid);
        //   // Store cleanup function
        //   window.cleanupPortfolioEntrance = cleanupPortfolioAnim;
        // }
        
        // Store references for cleanup
        window.portfolioController = portfolioController;
        // window.portfolioBgText = bgText;
        
        console.log('[HomeView] ✅ Portfolio initialized with Hannah Miles style');
      }

      
      // About section - Blob effect is purely CSS/SVG, no JS needed
      console.log('[HomeView] ✅ About blob effect initialized');
      
      // Initialize Bounce Entrance animations for new sections
      initBounceEntrance();
      
      // Initialize Testimonial Carousel
      const carousel = new TestimonialCarousel('.testimonials-carousel');
      if (carousel) {
        console.log('🎠 Testimonial carousel initialized');
        // Store reference for cleanup if needed
        window.testimonialCarousel = carousel;
      }
      
      // Initialize Contact Modal
      const contactModal = new ContactModal();
      contactModal.render();
      window.contactModal = contactModal;
      console.log('📧 Contact modal initialized');
    }
  }, 100);
  
  return template;
}
