/**
 * Image Modal - Cinematic Modal for Gallery Images
 * Reutiliza #modal-root (mismo que ABOUT)
 */
import { gsap } from 'gsap';

// Estado del modal
let currentModal = null;
let currentTrigger = null;
let abortController = null;

/**
 * Asegurar que #modal-root existe
 */
function ensureModalRoot() {
  let root = document.getElementById('modal-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'modal-root';
    document.body.appendChild(root);
  }
  return root;
}

/**
 * Abrir modal de imagen
 */
export function openImageModal(data, triggerEl) {
  // Si ya está abierto, ignorar
  if (currentModal) return;
  
  const root = ensureModalRoot();
  currentTrigger = triggerEl;
  
  // Crear HTML del modal
  const modalHTML = `
    <div class="image-overlay" data-state="open">
      <div class="image-card" role="dialog" aria-modal="true" aria-labelledby="image-title" tabindex="-1">
        <button class="image-close" aria-label="Close">×</button>

        <div class="image-grid">
          <div class="image-media">
            <img class="image-full" src="${data.img}" alt="${data.titulo}" />
          </div>

          <div class="image-content">
            <h2 id="image-title" class="image-title">${data.titulo}</h2>
            <p class="image-desc">${data.descripcion || 'A photographic exploration of light, shadow, and composition.'}</p>

            <div class="image-meta">
              <span class="image-pill">Year: ${data.year || '2024'}</span>
              <span class="image-pill">Category: ${data.categoria || 'Photography'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  root.innerHTML = modalHTML;
  currentModal = root.querySelector('.image-overlay');
  const card = currentModal.querySelector('.image-card');
  const closeBtn = currentModal.querySelector('.image-close');
  
  // Bloquear scroll del body
  document.body.style.overflow = 'hidden';
  
  // Listeners de cierre
  abortController = new AbortController();
  const signal = abortController.signal;
  
  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeImageModal();
  }, { signal });
  
  // Click en overlay (fuera del card)
  currentModal.addEventListener('click', (e) => {
    if (e.target === currentModal) closeImageModal();
  }, { signal });
  
  // Click en botón X
  closeBtn.addEventListener('click', closeImageModal, { signal });
  
  // Focus al card
  card.focus();
  
  // Animación de entrada GSAP (MISMA QUE ABOUT)
  gsap.set(currentModal, { opacity: 0 });
  gsap.set(card, { opacity: 0, y: 16, scale: 0.98 });
  
  const tl = gsap.timeline();
  tl.to(currentModal, {
    opacity: 1,
    duration: 0.22,
    ease: 'power2.out'
  });
  tl.to(card, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.40,
    ease: 'power3.out'
  }, '-=0.1');
}

/**
 * Cerrar modal de imagen
 */
export function closeImageModal() {
  if (!currentModal) return;
  
  const card = currentModal.querySelector('.image-card');
  
  // Animación de salida GSAP (MISMA QUE ABOUT)
  const tl = gsap.timeline({
    onComplete: () => {
      // Limpiar DOM
      const root = document.getElementById('modal-root');
      if (root) root.innerHTML = '';
      
      // Restaurar scroll
      document.body.style.overflow = '';
      
      // Restaurar foco
      if (currentTrigger) currentTrigger.focus();
      
      // Reset estado
      currentModal = null;
      currentTrigger = null;
    }
  });
  
  tl.to(card, {
    opacity: 0,
    y: 10,
    scale: 0.98,
    duration: 0.25,
    ease: 'power2.in'
  });
  tl.to(currentModal, {
    opacity: 0,
    duration: 0.20,
    ease: 'power2.in'
  }, '-=0.1');
  
  // Cancelar listeners
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
}

/**
 * Bind de todas las imágenes clickeables (idempotente)
 */
let imageCardsAbortController = null;

export function bindImageCards(rootEl) {
  // Limpiar binding anterior si existía
  if (imageCardsAbortController) {
    imageCardsAbortController.abort();
  }
  
  // Crear nuevo AbortController
  imageCardsAbortController = new AbortController();
  
  // Event delegation: escuchar clicks en .photo-media
  rootEl.addEventListener('click', (e) => {
    console.log('🖱️ Click detectado en:', e.target);
    
    const photoMedia = e.target.closest('.photo-media');
    console.log('📸 photoMedia encontrado:', photoMedia);
    
    if (!photoMedia) return;
    
    e.preventDefault();
    
    // Extraer data desde el elemento padre (photo-card o hero-float)
    const card = photoMedia.closest('[data-gallery-id], [data-hero-id]');
    console.log('🎴 Card encontrado:', card);
    console.log('📊 Datasets:', {
      galleryId: card?.dataset.galleryId,
      heroId: card?.dataset.heroId,
      title: card?.dataset.title,
      description: card?.dataset.description,
      year: card?.dataset.year,
      category: card?.dataset.category
    });
    
    if (!card) {
      console.warn('⚠️ No se encontró data en la imagen clickeada');
      return;
    }
    
    // Buscar la obra en el dataset global (si está disponible)
    const imageId = card.dataset.galleryId || card.dataset.heroId;
    
    // Crear data object desde atributos o usar defaults
    const data = {
      id: imageId,
      img: photoMedia.src || photoMedia.querySelector('img')?.src,
      titulo: card.dataset.title || photoMedia.alt || 'Untitled',
      descripcion: card.dataset.description || 'A stunning photographic composition.',
      year: card.dataset.year || '2024',
      categoria: card.dataset.category || 'Photography'
    };
    
    console.log('🚀 Abriendo modal con data:', data);
    openImageModal(data, photoMedia);
  }, { signal: imageCardsAbortController.signal });
  
  console.log('✅ Image cards vinculados al modal');
}
