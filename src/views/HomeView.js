import { obras } from '../data/obras.js';
import { bindEnterGalleryButton } from '../transitions/enterGallery.js';
import { initTitleAnimations } from '../animations/hero-scroll-title.js';
import VanillaTilt from '../lib/vanilla-tilt.js';

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
      <!-- SHOWCASE SECTION - WebGL Synchronized Masonry Grid -->
      <!-- ========================================== -->
      <section id="showcase" class="relative w-full min-h-[200vh] bg-transparent py-32 overflow-hidden">
        <div class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8">

          <!-- Item 0: Landscape (col-span-5) -->
          <div class="project-card col-span-12 md:col-span-5 showcase-item" data-layer="1" data-image-src="${obras[0].img}" data-title="${obras[0].titulo}">
            <!-- Blender Window Chrome -->
            <div class="h-6 bg-[#2d2d2d] rounded-t-md flex items-center px-2 border-b border-[#1a1a1a] w-full">
              <div class="flex gap-1.5">
                <div class="w-2 h-2 rounded-full bg-red-500"></div>
                <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <span class="ml-3 text-[10px] text-gray-300 font-mono truncate">
                ${obras[0].titulo}.blend
              </span>
            </div>
            <!-- Image Container - Landscape aspect ratio -->
            <div class="relative w-full aspect-[4/3] bg-[#1a1a1a] border border-[#2d2d2d] rounded-b-md overflow-hidden group">
              <img src="${obras[0].img}?tr=w-900,fo-auto" alt="${obras[0].titulo}" 
                   class="webgl-target w-full h-full object-cover opacity-100 group-hover:opacity-0 transition-opacity duration-300" 
                   loading="eager" />
            </div>
          </div>

          <!-- Item 1: Portrait (col-span-4 mt-32) -->
          <div class="project-card col-span-12 md:col-span-4 mt-0 md:mt-32 showcase-item" data-layer="2" data-image-src="${obras[1].img}" data-title="${obras[1].titulo}">
            <div class="h-6 bg-[#2d2d2d] rounded-t-md flex items-center px-2 border-b border-[#1a1a1a] w-full">
              <div class="flex gap-1.5">
                <div class="w-2 h-2 rounded-full bg-red-500"></div>
                <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <span class="ml-3 text-[10px] text-gray-300 font-mono truncate">
                ${obras[1].titulo}.blend
              </span>
            </div>
            <div class="relative w-full aspect-[3/4] bg-[#1a1a1a] border border-[#2d2d2d] rounded-b-md overflow-hidden group">
              <img src="${obras[1].img}?tr=w-700,fo-auto" alt="${obras[1].titulo}" 
                   class="webgl-target w-full h-full object-cover opacity-100 group-hover:opacity-0 transition-opacity duration-300" 
                   loading="eager" />
            </div>
          </div>

          <!-- Item 2: Wide/Video (col-span-6 mt-16) -->
          <div class="project-card col-span-12 md:col-span-6 mt-0 md:mt-16 showcase-item" data-layer="1" data-image-src="${obras[2].img}" data-title="${obras[2].titulo}">
            <div class="h-6 bg-[#2d2d2d] rounded-t-md flex items-center px-2 border-b border-[#1a1a1a] w-full">
              <div class="flex gap-1.5">
                <div class="w-2 h-2 rounded-full bg-red-500"></div>
                <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <span class="ml-3 text-[10px] text-gray-300 font-mono truncate">
                ${obras[2].titulo}.blend
              </span>
            </div>
            <div class="relative w-full aspect-video bg-[#1a1a1a] border border-[#2d2d2d] rounded-b-md overflow-hidden group">
              <img src="${obras[2].img}?tr=w-1000,fo-auto" alt="${obras[2].titulo}" 
                   class="webgl-target w-full h-full object-cover opacity-100 group-hover:opacity-0 transition-opacity duration-300" 
                   loading="eager" />
            </div>
          </div>

          <!-- Item 3: Square (col-span-5 mt-24) -->
          <div class="project-card col-span-12 md:col-span-5 mt-0 md:mt-24 showcase-item" data-layer="2" data-image-src="${obras[3].img}" data-title="${obras[3].titulo}">
            <div class="h-6 bg-[#2d2d2d] rounded-t-md flex items-center px-2 border-b border-[#1a1a1a] w-full">
              <div class="flex gap-1.5">
                <div class="w-2 h-2 rounded-full bg-red-500"></div>
                <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <span class="ml-3 text-[10px] text-gray-300 font-mono truncate">
                ${obras[3].titulo}.blend
              </span>
            </div>
            <div class="relative w-full aspect-square bg-[#1a1a1a] border border-[#2d2d2d] rounded-b-md overflow-hidden group">
              <img src="${obras[3].img}?tr=w-900,fo-auto" alt="${obras[3].titulo}" 
                   class="webgl-target w-full h-full object-cover opacity-100 group-hover:opacity-0 transition-opacity duration-300" 
                   loading="eager" />
            </div>
          </div>

          <!-- Item 4: Portrait (col-span-4 mt-8) -->
          <div class="project-card col-span-12 md:col-span-4 mt-0 md:mt-8 showcase-item" data-layer="1" data-image-src="${obras[4].img}" data-title="${obras[4].titulo}">
            <div class="h-6 bg-[#2d2d2d] rounded-t-md flex items-center px-2 border-b border-[#1a1a1a] w-full">
              <div class="flex gap-1.5">
                <div class="w-2 h-2 rounded-full bg-red-500"></div>
                <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <span class="ml-3 text-[10px] text-gray-300 font-mono truncate">
                ${obras[4].titulo}.blend
              </span>
            </div>
            <div class="relative w-full aspect-[3/4] bg-[#1a1a1a] border border-[#2d2d2d] rounded-b-md overflow-hidden group">
              <img src="${obras[4].img}?tr=w-700,fo-auto" alt="${obras[4].titulo}" 
                   class="webgl-target w-full h-full object-cover opacity-100 group-hover:opacity-0 transition-opacity duration-300" 
                   loading="eager" />
            </div>
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

        <!-- PORTFOLIO SECTION - Pinterest Masonry Grid -->
        <section id="portfolio" class="section-block relative min-h-screen bg-transparent py-20 px-6">
          <div class="max-w-7xl mx-auto">
            <!-- Title -->
            <h2 class="text-6xl md:text-7xl font-bold uppercase tracking-tighter text-white text-center mb-16">
              PORTF<span class="text-white/40">●</span>LIO
            </h2>
            
            <!-- Pinterest Masonry Grid -->
            <div class="masonry-grid">
              ${obras
                .map(value => ({ value, sort: Math.random() })) // Shuffle array
                .sort((a, b) => a.sort - b.sort)
                .map(({ value: obra }, index) => `
                <div class="masonry-item" data-obra-id="${obra.id}">
                  <div class="masonry-card group cursor-pointer">
                    <div class="masonry-img-wrapper">
                      <!-- Removed h-600 to allow natural height (masonry effect) -->
                      <img 
                        src="${obra.img}?tr=w-500,fo-auto" 
                        alt="${obra.titulo}"
                        loading="${index < 8 ? 'eager' : 'lazy'}"
                        class="masonry-img"
                        style="min-height: 200px; background: #222;"
                      />
                      <!-- Overlay on hover -->
                      <div class="masonry-overlay">
                        <h3 class="text-xl font-bold text-white mb-2">${obra.titulo}</h3>
                        <p class="text-sm text-white/80 mb-2">${obra.categoria} • ${obra.year}</p>
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <!-- Next Section Arrow -->
            <div class="w-full flex justify-center py-20">
              <a href="#services" class="scroll-arrow group" aria-label="Go to Services">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" class="text-white/70 group-hover:text-white transition-colors duration-300 animate-bounce">
                  <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>
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
    }
  }, 100);
  
  return template;
}
