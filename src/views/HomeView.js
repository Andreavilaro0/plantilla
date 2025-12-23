import { obras } from '../data/obras.js';
import { generateLayout } from '../utils/layoutEngine.js';
import { bindEnterGalleryButton } from '../transitions/enterGallery.js';
import { bindImageCards } from '../ui/imageModal.js';
import { initTitleAnimations } from '../animations/hero-scroll-title.js';
import { initLoadingScreen } from '../animations/loading-screen.js';

export default function HomeView() {
  // ============================================
  // PHOTOGRAPHER DATA (para modal ABOUT)
  // ============================================
  const photographerData = {
    name: 'portfolio',
    portraitSrc: '/portrait.jpg',
    bio1: 'Contemporary photographer specializing in urban landscapes and architectural photography. My work explores the intersection of light, geometry, and human spaces.',
    bio2: 'Featured in various exhibitions and publications, I aim to capture the fleeting beauty of everyday moments through a unique visual perspective.',
    city: 'Barcelona, Spain',
    focus: 'Urban & Architecture'
  };
  
  // ============================================
  // SEPARACIÓN ESTRICTA: Hero (1-5) vs Gallery (6-47)
  // ============================================
  const heroImages = obras.slice(0, 5);  // Primeras 5 para hero
  const galleryImages = obras.slice(5); // Resto para gallery
  
  console.log(`📸 Hero: ${heroImages.length} imágenes | Gallery: ${galleryImages.length} imágenes`);
  
  // ============================================
  // GENERAR LAYOUT DETERMINISTA (solo para gallery)
  // ============================================
  const { positions, totalHeight } = generateLayout(galleryImages, {
    addHeroExclusion: true // Activar zona de exclusión del título
  });
  
  // ============================================
  // HERO: Estructura exacta Claude Monet
  // 5 cuadros flotantes con posiciones fijas
  // ============================================
  const heroFloats = [
    { pos: 'left-frame', left: '5vw', top: '12vh', width: '180px', height: '240px', depth: '1' },
    { pos: 'top-frame', left: '48vw', top: '8vh', width: '150px', height: '180px', depth: '2' },
    { pos: 'right-frame', left: '75vw', top: '15vh', width: '280px', height: '220px', depth: '1' },
    { pos: 'bottom-left', left: '10vw', top: '70vh', width: '240px', height: '200px', depth: '3' },
    { pos: 'bottom-right', left: '72vw', top: '68vh', width: '240px', height: '280px', depth: '2' }
  ];

  const heroFloatHTML = heroFloats.map((frame, index) => {
    const obra = heroImages[index];
    const isFirstImage = index === 0;
    
    return `
      <figure class="hero-float photo-card pos-${frame.pos} pointer-events-auto" 
              data-depth="${frame.depth}"
              data-hero-id="${obra.id}"
              data-title="${obra.titulo.replace(/"/g, '&quot;')}"
              data-description="${obra.descripcion.replace(/"/g, '&quot;').replace(/'/g, '&apos;')}"
              data-year="${obra.year}"
              data-category="${obra.categoria}"
              style="position: absolute; left: ${frame.left}; top: ${frame.top}; width: ${frame.width}; height: ${frame.height}; will-change: transform;">
        <div class="photo-media relative w-full h-full cursor-pointer">
          <picture>
            <source 
              type="image/avif" 
              srcset="${obra.img}?tr=f-avif,w-400 400w, ${obra.img}?tr=f-avif,w-800 800w"
              sizes="(max-width: 768px) 200px, ${frame.width}" />
            <source 
              type="image/webp" 
              srcset="${obra.img}?tr=f-webp,w-400 400w, ${obra.img}?tr=f-webp,w-800 800w"
              sizes="(max-width: 768px) 200px, ${frame.width}" />
            <img 
              class="w-full h-full object-contain rounded-lg" 
              src="${obra.img}" 
              alt="${obra.titulo} - ${obra.categoria} photography"
              loading="${isFirstImage ? 'eager' : 'lazy'}"
              decoding="async"
              ${isFirstImage ? 'fetchpriority="high"' : ''} />
          </picture>
        </div>
      </figure>
    `;
  }).join('');
  
  // ============================================
  // GALLERY FIELD: Imágenes con posicionamiento absoluto
  // SIN REPETIR - Solo obras 9-47
  // SIN GRAYSCALE - Solo color original
  // ============================================
  const galleryCards = positions.map((pos, index) => {
    const obra = galleryImages[index];
    
    return `
      <!-- WRAPPER: Para GSAP (parallax, scroll reveal) -->
      <div
        class="photo-card absolute will-change-transform"
        style="left: ${pos.x}px; top: ${pos.y}px; width: ${pos.width}px; height: ${pos.height}px; z-index: ${pos.zIndex};"
        data-index="${obra.id}"
        data-band="${pos.bandIndex}"
        data-scroll-speed="${pos.scrollSpeed}"
        data-parallax-speed="${pos.parallaxSpeed}"
        data-gallery-id="${obra.id}"
        data-title="${obra.titulo.replace(/"/g, '&quot;')}"
        data-description="${obra.descripcion.replace(/"/g, '&quot;').replace(/'/g, '&apos;')}"
        data-year="${obra.year}"
        data-category="${obra.categoria}">
        
        <!-- INNER: Para Tailwind hover (NO afecta positioning) -->
        <div class="photo-media relative w-full h-full cursor-pointer overflow-hidden rounded-xl transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-white/20 group">
          <!-- IMAGEN SIN FILTROS GRAYSCALE -->
          <img
            src="${obra.img}"
            alt="${obra.titulo}"
            class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            loading="lazy">
          
          <!-- Overlay info (solo opacity/blur, SIN filtros de color) -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
            <h3 class="text-2xl font-serif italic text-white mb-2">${obra.titulo}</h3>
            <div class="flex justify-between text-xs text-white/80 uppercase tracking-widest">
              <span>${obra.categoria}</span>
              <span>${obra.year}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const template = `
    <div class="relative w-full min-h-screen bg-black text-white overflow-x-hidden">
      
      <!-- CINEMATIC TRANSITION CURTAIN -->
      <div id="transition-curtain"></div>

      <!-- ========================================== -->
      <!-- LOADING SCREEN - Max Milkin Style -->
      <!-- ========================================== -->
      <div id="loading-screen" class="loading-screen">
        <!-- Percentage Counter -->
        <div id="loading-percentage" class="loading-percentage">0%</div>
        
        <!-- Orbiting Text Particles Container -->
        <div id="orbit-particles" class="orbit-particles-container"></div>
      </div>

      <!-- ========================================== -->
      <!-- HERO SECTION - Claude Monet Exact Replica -->
      <!-- ========================================== -->
      <section id="hero" class="relative overflow-hidden" style="min-height: 100vh; opacity: 0;">
        <!-- Background with glow -->
        <div class="hero-bg absolute inset-0 bg-black"></div>

        <!-- Floating frames container (BEHIND title) -->
        <div id="hero-floats" class="absolute inset-0 z-5 pointer-events-none">
          ${heroFloatHTML}
        </div>

        <!-- Title + Subtitle + CTA (IN FRONT) -->
        <div class="hero-text relative z-20 flex flex-col justify-center" style="min-height: 100vh; padding-inline: max(5vw, 2rem); box-sizing: border-box;">
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
      <!-- GALLERY FIELD - Immersive Layout -->
      <!-- Solo imágenes 6-47, sin colisiones -->
      <!-- ========================================== -->
      <section id="gallery-field" class="relative bg-black" style="min-height: ${totalHeight}px;">
        <!-- Título de sección -->
        <div class="relative z-40 text-center pt-80 pb-24">
          <h2 class="text-5xl md:text-6xl font-serif italic opacity-90 text-white">
            Selected Works
          </h2>
          <p class="text-sm uppercase tracking-widest opacity-60 mt-4 text-white/70">
            ${galleryImages.length} Photographs
          </p>
        </div>
        
        <!-- Campo de imágenes con posicionamiento absoluto (sin superposición) -->
        <div class="relative w-full">
          ${galleryCards}
        </div>
        
        <!-- Padding final -->
        <div class="h-32"></div>
      </section>

      <!-- ========================================== -->
      <!-- MODAL OVERLAY -->
      <!-- ========================================== -->
      <div id="modal-overlay" class="fixed inset-0 bg-black/95 z-[100] hidden flex-col justify-center items-center backdrop-blur-0">
        <!-- Botón cerrar -->
        <button
          id="modal-close"
          class="absolute top-8 right-8 z-50 text-white text-sm uppercase tracking-widest px-6 py-3 border border-white/30 rounded-full hover:bg-white/10 hover:opacity-80 transition-all duration-300">
          Close ×
        </button>
        
        <!-- Contenedor de imagen -->
        <div class="relative w-[85vw] h-[80vh] flex items-center justify-center">
          <!-- Navegación anterior -->
          <button
            id="modal-prev"
            class="absolute left-0 md:left-[-70px] z-10 p-4 text-white text-6xl hover:opacity-60 transition-opacity duration-300 hover:scale-110">
            ←
          </button>
          
          <!-- Imagen modal (SIN filtros grayscale, con marco barroco) -->
          <img
            id="modal-img"
            src=""
            alt=""
            class="max-w-full max-h-full object-contain rounded-2xl shadow-2xl">
          
          <!-- Navegación siguiente -->
          <button
            id="modal-next"
            class="absolute right-0 md:right-[-70px] z-10 p-4 text-white text-6xl hover:opacity-60 transition-opacity duration-300 hover:scale-110">
            →
          </button>
        </div>
        
        <!-- Info de la imagen -->
        <div class="absolute bottom-12 left-12 text-white z-10">
          <h2 id="modal-title" class="text-5xl md:text-6xl italic font-serif font-light tracking-wide mb-3">
            Título
          </h2>
          <div class="flex gap-8 text-sm opacity-70 uppercase tracking-widest">
            <p id="modal-category">Categoría</p>
            <p id="modal-year">2024</p>
          </div>
        </div>
      </div>

    </div>
  `;
  
  // ============================================
  // Bind buttons e images después del render
  // ============================================
  setTimeout(() => {
    const app = document.querySelector('#app');
    if (app) {
      // Initialize loading screen FIRST (Max Milkin style)
      initLoadingScreen();
      
      // About button is now in global navbar, not here
      bindEnterGalleryButton(app);
      bindImageCards(app); // Bind todas las imágenes clickeables
      initTitleAnimations(); // Init MANDATORY advanced title animations
    }
  }, 100);
  
  return template;
}
