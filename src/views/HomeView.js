import { obras } from '../data/obras.js';
import { generateLayout } from '../utils/layoutEngine.js';
import { bindAboutButton } from '../ui/aboutModal.js';
import { bindEnterGalleryButton } from '../transitions/enterGallery.js';
import { bindImageCards } from '../ui/imageModal.js';
import { initTitleAnimations } from '../animations/hero-scroll-title.js';

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
    { pos: 'left-frame', left: '4vw', top: '12vh', width: '220px', height: '290px', depth: '1' },
    { pos: 'top-frame', left: '48vw', top: '2vh', width: '170px', height: '200px', depth: '2' },
    { pos: 'right-frame', left: '72vw', top: '12vh', width: '340px', height: '260px', depth: '1' },
    { pos: 'bottom-left', left: '14vw', top: '72vh', width: '280px', height: '220px', depth: '3' },
    { pos: 'bottom-right', left: '70vw', top: '70vh', width: '280px', height: '340px', depth: '2' }
  ];

  const heroFloatHTML = heroFloats.map((frame, index) => {
    const obra = heroImages[index];
    return `
      <figure class="hero-float photo-card pos-${frame.pos} pointer-events-auto" 
              data-depth="${frame.depth}"
              data-hero-id="${obra.id}"
              data-title="${obra.titulo.replace(/"/g, '&quot;')}"
              data-description="${obra.descripcion.replace(/"/g, '&quot;').replace(/'/g, '&apos;')}"
              data-year="${obra.year}"
              data-category="${obra.categoria}"
              style="position: absolute; left: ${frame.left}; top: ${frame.top}; width: ${frame.width}; height: ${frame.height}; will-change: transform;">
        <div class="photo-media frame-real relative w-full h-full cursor-pointer">
          <img class="w-full h-full object-cover rounded-lg" 
               src="${obra.img}" 
               alt="${obra.titulo}" />
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
        <div class="photo-media baroque-frame relative w-full h-full cursor-pointer overflow-hidden rounded-xl transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-white/20 group">
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
      <!-- HERO SECTION - Claude Monet Exact Replica -->
      <!-- ========================================== -->
      <section id="hero" class="relative overflow-hidden" style="min-height: 100vh;">
        <!-- Background with glow -->
        <div class="hero-bg absolute inset-0 bg-black"></div>

        <!-- Top bar: Brand + About -->
        <div class="hero-top absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-10 pt-8">
          <div class="hero-brand text-white/90 text-sm tracking-[0.22em]">PHOTOGRAPHY PORTFOLIO</div>
          <button class="hero-about rounded-full border border-white/25 px-5 py-2 text-sm text-white/80 hover:bg-white/10 transition-all duration-300">ABOUT</button>
        </div>

        <!-- Title + Subtitle + CTA -->
        <div class="hero-text relative z-20 flex flex-col justify-center" style="min-height: 100vh; padding-inline: max(5vw, 2rem); box-sizing: border-box;">
            <!-- Editorial Aggressive Layout -->
            <!-- MANDATORY HERO TITLE SHELL -->
            <div class="hero-title-shell">
              <h1 id="hero-title" class="hero-title">
                <span class="title-mask">
                  <span class="title-line line-1">IMMERSIVE</span>
                </span>
                <span class="title-mask">
                  <span class="title-line line-2">GALLERY</span>
                </span>
              </h1>
            </div>

          <!-- CTA Row: Button + Arrow -->
          <div class="hero-cta-row flex items-center justify-center gap-6 mt-12">
            <button class="hero-enter rounded-full border border-white/30 px-8 py-3 text-sm text-white/90 tracking-widest hover:bg-white/10 transition-all duration-300">
              ENTER GALLERY
            </button>
            <span class="hero-arrow text-white/70 text-3xl">→</span>
          </div>
        </div>

        <!-- Floating frames container -->
        <div id="hero-floats" class="absolute inset-0 z-10 pointer-events-none">
          ${heroFloatHTML}
        </div>
      </section>

      <!-- ========================================== -->
      <!-- GALLERY FIELD - Immersive Layout -->
      <!-- Solo imágenes 6-47, sin colisiones -->
      <!-- ========================================== -->
      <section id="gallery-field" class="relative bg-black" style="min-height: ${totalHeight}px;">
        <!-- Título de sección -->
        <div class="relative z-40 text-center pt-50 pb-16">
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
            class="baroque-frame max-w-full max-h-full object-contain rounded-2xl shadow-2xl">
          
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
      bindAboutButton(app, photographerData);
      bindEnterGalleryButton(app);
      bindImageCards(app); // Bind todas las imágenes clickeables
      initTitleAnimations(); // Init MANDATORY advanced title animations
    }
  }, 100);
  
  return template;
}
