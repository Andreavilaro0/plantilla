/**
 * PortfolioScene.js - 3D Interactive Portfolio with Scatter Animation
 * Features:
 * - Scroll-triggered scatter animation
 * - Drag & drop cards
 * - Double-click to open modal with navigation
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(ScrollTrigger, Draggable);

let cards = [];
let currentModal = null;
let currentIndex = 0;

/**
 * Initialize the 3D portfolio scene
 */
export function initPortfolio3D() {
  const container = document.querySelector('#portfolio-3d-container');
  if (!container) {
    console.warn('⚠️ Portfolio 3D container not found');
    return;
  }

  // Get obras data from global or import
  const obras = window.obrasData || [];
  if (obras.length === 0) {
    console.warn('⚠️ No obras data available');
    return;
  }

  // Create cards
  createCards(container, obras);
  
  // Setup scroll-triggered scatter animation
  setupScatterAnimation();
  
  // Setup drag & drop
  setupDragDrop();
  
  // Setup double-click modal
  setupModalInteraction(obras);
  
  console.log('✅ Portfolio 3D initialized with', cards.length, 'cards');
}

/**
 * Create portfolio cards
 */
function createCards(container, obras) {
  // Clear existing cards
  container.innerHTML = '';
  cards = [];
  
  const gridCols = 5;
  const gridRows = Math.ceil(obras.length / gridCols);
  const cardWidth = 280;
  const cardHeight = 350;
  const gap = 40;
  
  obras.forEach((obra, index) => {
    const card = document.createElement('div');
    card.className = 'portfolio-card';
    card.dataset.index = index;
    card.dataset.id = obra.id;
    
    // Calculate initial grid position
    const col = index % gridCols;
    const row = Math.floor(index / gridCols);
    const x = col * (cardWidth + gap);
    const y = row * (cardHeight + gap);
    
    card.innerHTML = `
      <div class="card-inner">
        <img src="${obra.img}" alt="${obra.titulo}" class="card-image" loading="lazy" />
        <div class="card-overlay">
          <h3 class="card-title">${obra.titulo}</h3>
          <p class="card-category">${obra.categoria}</p>
        </div>
      </div>
    `;
    
    // Set initial position
    gsap.set(card, {
      x: x,
      y: y,
      width: cardWidth,
      height: cardHeight,
      position: 'absolute',
      top: 0,
      left: 0
    });
    
    container.appendChild(card);
    cards.push({
      element: card,
      initialX: x,
      initialY: y,
      scattered: false
    });
  });
  
  // Set container height
  const totalHeight = gridRows * (cardHeight + gap) + 200;
  container.style.minHeight = `${totalHeight}px`;
}

/**
 * Setup scroll-triggered scatter animation
 */
function setupScatterAnimation() {
  cards.forEach((cardData, index) => {
    const card = cardData.element;
    
    // Create scatter animation on scroll
    ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => scatterCard(cardData, index),
      onEnterBack: () => scatterCard(cardData, index),
      once: false
    });
  });
}

/**
 * Scatter individual card with random offset
 */
function scatterCard(cardData, index) {
  if (cardData.scattered) return;
  
  const maxOffset = 150;
  const randomX = (Math.random() - 0.5) * maxOffset;
  const randomY = (Math.random() - 0.5) * maxOffset;
  const randomRotation = (Math.random() - 0.5) * 15;
  const randomScale = 0.95 + Math.random() * 0.1;
  
  gsap.to(cardData.element, {
    x: cardData.initialX + randomX,
    y: cardData.initialY + randomY,
    rotation: randomRotation,
    scale: randomScale,
    duration: 0.8,
    delay: index * 0.02,
    ease: 'power2.out',
    onComplete: () => {
      cardData.scattered = true;
    }
  });
}

/**
 * Setup drag & drop for cards
 */
function setupDragDrop() {
  cards.forEach(cardData => {
    Draggable.create(cardData.element, {
      type: 'x,y',
      edgeResistance: 0.65,
      bounds: '#portfolio-3d-container',
      inertia: true,
      zIndexBoost: false,
      onPress: function() {
        gsap.to(this.target, {
          scale: 1.05,
          duration: 0.2,
          zIndex: 100
        });
      },
      onRelease: function() {
        gsap.to(this.target, {
          scale: 1,
          duration: 0.3,
          zIndex: 'auto'
        });
      }
    });
  });
  
  console.log('✅ Drag & drop enabled for', cards.length, 'cards');
}

/**
 * Setup double-click modal interaction
 */
function setupModalInteraction(obras) {
  cards.forEach(cardData => {
    const card = cardData.element;
    const index = parseInt(card.dataset.index);
    
    card.addEventListener('dblclick', () => {
      openModal(obras, index);
    });
  });
}

/**
 * Open modal with obra details and navigation
 */
function openModal(obras, startIndex) {
  currentIndex = startIndex;
  
  if (currentModal) {
    closeModal();
  }
  
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.className = 'portfolio-modal-overlay';
  overlay.innerHTML = `
    <div class="portfolio-modal">
      <button class="modal-close">×</button>
      <button class="modal-nav modal-prev">←</button>
      <button class="modal-nav modal-next">→</button>
      
      <div class="modal-content">
        <div class="modal-image-container">
          <img src="" alt="" class="modal-image" />
        </div>
        <div class="modal-info">
          <h2 class="modal-title"></h2>
          <p class="modal-description"></p>
          <div class="modal-meta">
            <span class="modal-category"></span>
            <span class="modal-year"></span>
          </div>
        </div>
      </div>
      
      <div class="modal-counter">
        <span class="current-index"></span> / <span class="total-count">${obras.length}</span>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  currentModal = overlay;
  
  // Populate with current obra
  updateModalContent(obras);
  
  // Block body scroll
  document.body.style.overflow = 'hidden';
  
  // Event listeners
  const closeBtn = overlay.querySelector('.modal-close');
  const prevBtn = overlay.querySelector('.modal-prev');
  const nextBtn = overlay.querySelector('.modal-next');
  
  closeBtn.addEventListener('click', closeModal);
  prevBtn.addEventListener('click', () => navigateModal(obras, -1));
  nextBtn.addEventListener('click', () => navigateModal(obras, 1));
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboardNav);
  
  // Animate in
  gsap.fromTo(overlay, 
    { opacity: 0 },
    { opacity: 1, duration: 0.3 }
  );
  
  gsap.fromTo(overlay.querySelector('.portfolio-modal'),
    { scale: 0.9, y: 50 },
    { scale: 1, y: 0, duration: 0.4, ease: 'power3.out' }
  );
}

/**
 * Update modal content with current obra
 */
function updateModalContent(obras) {
  if (!currentModal) return;
  
  const obra = obras[currentIndex];
  const modal = currentModal.querySelector('.portfolio-modal');
  
  modal.querySelector('.modal-image').src = obra.img;
  modal.querySelector('.modal-image').alt = obra.titulo;
  modal.querySelector('.modal-title').textContent = obra.titulo;
  modal.querySelector('.modal-description').textContent = obra.descripcion;
  modal.querySelector('.modal-category').textContent = obra.categoria;
  modal.querySelector('.modal-year').textContent = obra.year;
  modal.querySelector('.current-index').textContent = currentIndex + 1;
}

/**
 * Navigate between obras in modal
 */
function navigateModal(obras, direction) {
  currentIndex += direction;
  
  // Wrap around
  if (currentIndex < 0) currentIndex = obras.length - 1;
  if (currentIndex >= obras.length) currentIndex = 0;
  
  updateModalContent(obras);
  
  // Animate transition
  const modalContent = currentModal.querySelector('.modal-content');
  gsap.fromTo(modalContent,
    { x: direction * 30, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.3 }
  );
}

/**
 * Handle keyboard navigation in modal
 */
function handleKeyboardNav(e) {
  if (!currentModal) return;
  
  const obras = window.obrasData || [];
  
  if (e.key === 'Escape') {
    closeModal();
  } else if (e.key === 'ArrowLeft') {
    navigateModal(obras, -1);
  } else if (e.key === 'ArrowRight') {
    navigateModal(obras, 1);
  }
}

/**
 * Close modal
 */
function closeModal() {
  if (!currentModal) return;
  
  // Animate out
  gsap.to(currentModal, {
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      currentModal.remove();
      currentModal = null;
      document.body.style.overflow = '';
    }
  });
  
  document.removeEventListener('keydown', handleKeyboardNav);
}

/**
 * Cleanup function
 */
export function cleanupPortfolio3D() {
  cards = [];
  if (currentModal) {
    closeModal();
  }
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
}
