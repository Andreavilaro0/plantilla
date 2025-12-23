/**
 * About Modal - Cinematic Modal for Monet Gallery
 * Montado en #modal-root (fuera del #app)
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
 * Abrir modal ABOUT
 */
export function openAboutModal(data, triggerEl) {
  // Si ya está abierto, ignorar
  if (currentModal) return;
  
  const root = ensureModalRoot();
  currentTrigger = triggerEl;
  
  // Crear HTML del modal
  const modalHTML = `
    <div class="about-overlay" data-state="open">
      <div class="about-card" role="dialog" aria-modal="true" aria-labelledby="about-title" tabindex="-1">
        <button class="about-close" aria-label="Close">×</button>
        <div class="about-grid">
          <div class="about-media">
            <img class="about-photo" src="${data.portraitSrc}" alt="Portrait of ${data.name}" />
          </div>
          <div class="about-content">
            <h2 id="about-title" class="about-name">${data.name}</h2>
            <p class="about-bio">${data.bio1}</p>
            <p class="about-bio">${data.bio2}</p>
            <div class="about-tags">
              <span class="about-pill">Based: ${data.city}</span>
              <span class="about-pill">Focus: ${data.focus}</span>
            </div>
            
            <!-- CTAs -->
            <div class="about-actions" style="display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap;">
              <button id="about-view-work" class="about-cta-primary" style="flex: 1; min-width: 140px; padding: 12px 24px; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.08); color: white; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.25s ease; letter-spacing: 0.3px;">
                Explorar trabajo
              </button>
              <a href="/contact" data-link id="about-book" class="about-cta-secondary" style="flex: 1; min-width: 140px; padding: 12px 24px; border-radius: 24px; border: 1px solid rgba(59, 130, 246, 0.3); background: rgba(59, 130, 246, 0.1); color: white; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.25s ease; text-align: center; text-decoration: none; display: inline-block; letter-spacing: 0.3px;">
                Reservar sesión
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  `;
  
  root.innerHTML = modalHTML;
  currentModal = root.querySelector('.about-overlay');
  const card = currentModal.querySelector('.about-card');
  const closeBtn = currentModal.querySelector('.about-close');
  
  // Bloquear scroll del body
  document.body.style.overflow = 'hidden';
  
  // Listeners de cierre
  abortController = new AbortController();
  const signal = abortController.signal;
  
  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAboutModal();
  }, { signal });
  
  // Click en overlay (fuera del card)
  currentModal.addEventListener('click', (e) => {
    if (e.target === currentModal) closeAboutModal();
  }, { signal });
  
  // Click en botón X
  closeBtn.addEventListener('click', closeAboutModal, { signal });
  
  // Focus al card
  card.focus();
  
  // Event listeners para CTAs
  const viewWorkBtn = currentModal.querySelector('#about-view-work');
  const bookBtn = currentModal.querySelector('#about-book');
  
  if (viewWorkBtn) {
    viewWorkBtn.addEventListener('click', () => {
      // Cerrar modal
      closeAboutModal();
      // Esperar a que cierre y hacer scroll suave
      setTimeout(() => {
        const gallery = document.querySelector('#gallery-field');
        if (gallery) {
          gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }, { signal });
  }
  
  // bookBtn usa data-link del router, no necesita listener adicional
  
  // Animación de entrada GSAP
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
 * Cerrar modal ABOUT
 */
export function closeAboutModal() {
  if (!currentModal) return;
  
  const card = currentModal.querySelector('.about-card');
  
  // Animación de salida GSAP
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
 * Bind del botón ABOUT (idempotente)
 */
let currentBoundButton = null;
let buttonAbortController = null;

export function bindAboutButton(rootEl, data) {
  // Limpiar binding anterior si existía
  if (buttonAbortController) {
    buttonAbortController.abort();
  }
  
  // Buscar botón ABOUT dentro del rootEl
  const aboutBtn = rootEl.querySelector('.hero-about');
  if (!aboutBtn) {
    console.warn('⚠️ Botón .hero-about no encontrado en el rootEl');
    return;
  }
  
  // Crear nuevo AbortController para este binding
  buttonAbortController = new AbortController();
  
  // Adjuntar listener
  aboutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openAboutModal(data, aboutBtn);
  }, { signal: buttonAbortController.signal });
  
  currentBoundButton = aboutBtn;
  console.log('✅ Botón ABOUT vinculado al modal');
}
