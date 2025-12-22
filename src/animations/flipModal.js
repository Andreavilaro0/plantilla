/**
 * FLIP Modal - Transición manual de thumbnail a fullscreen con blur
 */
import { gsap } from 'gsap';
import { obras } from '../data/obras.js';

let currentIndex = 0;
let imageClone = null;
let isOpen = false;

export function initFlipModal() {
  const modal = document.getElementById('modal-overlay');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalYear = document.getElementById('modal-year');
  const closeBtn = document.getElementById('modal-close');
  const prevBtn = document.getElementById('modal-prev');
  const nextBtn = document.getElementById('modal-next');
  
  if (!modal) return;
  
  // Event listeners para cards
  const cards = document.querySelectorAll('.photo-media');
  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      const wrapper = card.closest('.photo-card');
      const index = parseInt(wrapper.dataset.index);
      const img = card.querySelector('img');
      
      openModal(index, img);
    });
  });
  
  // Event listeners para controles
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));
  
  // Teclado
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

/**
 * Abre modal con FLIP animation
 */
function openModal(index, sourceImg) {
  if (isOpen || !sourceImg) return;
  
  isOpen = true;
  currentIndex = index;
  const obra = obras[index];
  
  const modal = document.getElementById('modal-overlay');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalYear = document.getElementById('modal-year');
  
  // PASO 1: First - Capturar posición inicial
  const sourceRect = sourceImg.getBoundingClientRect();
  
  // PASO 2: Last - Calcular posición final
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const finalWidth = Math.min(viewportWidth * 0.85, 1200);
  const finalHeight = viewportHeight * 0.8;
  const finalX = (viewportWidth - finalWidth) / 2;
  const finalY = (viewportHeight - finalHeight) / 2;
  
  // PASO 3: Crear clon en posición inicial
  imageClone = document.createElement('img');
  imageClone.src = obra.img;
  imageClone.style.cssText = `
    position: fixed;
    top: ${sourceRect.top}px;
    left: ${sourceRect.left}px;
    width: ${sourceRect.width}px;
    height: ${sourceRect.height}px;
    object-fit: cover;
    z-index: 100;
    border-radius: 12px;
    pointer-events: none;
  `;
  document.body.appendChild(imageClone);
  
  // Mostrar backdrop con blur
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  
  gsap.fromTo(modal,
    { opacity: 0, backdropFilter: 'blur(0px)' },
    { 
      opacity: 1, 
      backdropFilter: 'blur(20px)',
      duration: 0.5, 
      ease: 'power2.out' 
    }
  );
  
  // Ocultar contenido real inicialmente
  gsap.set([modalImg, modalTitle, modalCategory, modalYear], { opacity: 0 });
  
  // PASO 4: Invert + Play - Animar clon
  gsap.to(imageClone, {
    top: finalY,
    left: finalX,
    width: finalWidth,
    height: finalHeight,
    borderRadius: '16px',
    duration: 0.7,
    ease: 'power3.out',
    onComplete: () => {
      // Actualizar contenido real
      modalImg.src = obra.img;
      modalImg.alt = obra.titulo;
      modalTitle.textContent = obra.titulo;
      modalCategory.textContent = obra.categoria;
      modalYear.textContent = obra.year;
      
      // Fade in contenido real
      gsap.to(modalImg, { opacity: 1, duration: 0.4 });
      gsap.to([modalTitle, modalCategory, modalYear], {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08
      });
      
      // Remover clon
      if (imageClone) {
        imageClone.remove();
        imageClone = null;
      }
    }
  });
}

/**
 * Cierra el modal
 */
function closeModal() {
  if (!isOpen) return;
  
  const modal = document.getElementById('modal-overlay');
  
  // Limpiar clon si existe
  if (imageClone) {
    imageClone.remove();
    imageClone = null;
  }
  
  gsap.to(modal, {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    duration: 0.4,
    ease: 'power2.in',
    onComplete: () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      isOpen = false;
    }
  });
}

/**
 * Navega entre imágenes
 */
function navigate(direction) {
  currentIndex = (currentIndex + direction + obras.length) % obras.length;
  const obra = obras[currentIndex];
  
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalYear = document.getElementById('modal-year');
  
  // Animación de salida
  gsap.to(modalImg, {
    opacity: 0,
    scale: 0.95,
    x: direction > 0 ? -30 : 30,
    duration: 0.25,
    ease: 'power2.in',
    onComplete: () => {
      // Actualizar contenido
      modalImg.src = obra.img;
      modalImg.alt = obra.titulo;
      modalTitle.textContent = obra.titulo;
      modalCategory.textContent = obra.categoria;
      modalYear.textContent = obra.year;
      
      // Animación de entrada
      gsap.fromTo(modalImg,
        { opacity: 0, scale: 0.95, x: direction > 0 ? 30 : -30 },
        { opacity: 1, scale: 1, x: 0, duration: 0.35, ease: 'power2.out' }
      );
      
      gsap.fromTo([modalTitle, modalCategory, modalYear],
        { opacity: 0, x: direction > 0 ? 15 : -15 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05 }
      );
    }
  });
}
