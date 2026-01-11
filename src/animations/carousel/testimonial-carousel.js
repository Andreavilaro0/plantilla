import gsap from 'gsap';
import { log, warn } from '@/utils/logger.js';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

/**
 * Testimonial Carousel
 * GSAP-based carousel replacing Swiper.js
 * Features: Drag to scroll, navigation buttons, snap to nearest
 */

export class TestimonialCarousel {
  constructor(containerSelector = '.testimonials-carousel') {
    this.container = document.querySelector(containerSelector);
    
    if (!this.container) {
      warn(`⚠️ Carousel container "${containerSelector}" not found`);
      return;
    }
    
    this.track = this.container.querySelector('.carousel-track');
    this.cards = [...this.track.children];
    this.prevBtn = this.container.querySelector('.prev');
    this.nextBtn = this.container.querySelector('.next');
    
    this.currentIndex = 0;
    this.cardGap = 32; // 2rem gap (must match CSS)
    this.draggableInstance = null;
    
    this.init();
  }
  
  init() {
    if (!this.track || this.cards.length === 0) {
      warn('⚠️ Carousel track or cards not found');
      return;
    }
    
    // Calculate dimensions
    this.updateDimensions();
    
    // Resize handler
    this.resizeHandler = () => this.updateDimensions();
    window.addEventListener('resize', this.resizeHandler);
    
    // Enable drag interaction with Draggable
    this.initDraggable();
    
    // Navigation buttons
    this.initNavigation();
    
    // Update button states
    this.updateButtonStates();
    
    log(`🎠 Carousel initialized with ${this.cards.length} slides`);
  }
  
  updateDimensions() {
    const firstCard = this.cards[0];
    if (!firstCard) return;
    
    this.cardWidth = firstCard.offsetWidth;
    this.containerWidth = this.container.offsetWidth;
    
    // Calculate max scroll distance
    const totalWidth = (this.cardWidth + this.cardGap) * this.cards.length - this.cardGap;
    this.maxScroll = Math.max(0, totalWidth - this.containerWidth);
  }
  
  initDraggable() {
    this.draggableInstance = Draggable.create(this.track, {
      type: 'x',
      bounds: {
        minX: -this.maxScroll,
        maxX: 0
      },
      inertia: true,
      onDrag: () => {
        this.updateButtonStates();
      },
      onDragEnd: () => {
        this.snapToNearest();
      },
      onThrowUpdate: () => {
        // Update during inertia throw
        this.currentIndex = this.calculateNearestIndex();
      },
      onThrowComplete: () => {
        this.snapToNearest();
      }
    })[0];
  }
  
  initNavigation() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }
  }
  
  calculateNearestIndex() {
    const currentX = gsap.getProperty(this.track, 'x');
    const nearestIndex = Math.round(-currentX / (this.cardWidth + this.cardGap));
    return Math.max(0, Math.min(nearestIndex, this.cards.length - 1));
  }
  
  goTo(index, animate = true) {
    const newIndex = Math.max(0, Math.min(index, this.cards.length - 1));
    const x = -newIndex * (this.cardWidth + this.cardGap);
    
    // Clamp to bounds
    const clampedX = Math.max(-this.maxScroll, Math.min(0, x));
    
    if (animate) {
      gsap.to(this.track, {
        x: clampedX,
        duration: 0.6,
        ease: 'power2.inOut',
        onUpdate: () => {
          // Update Draggable bounds during animation
          if (this.draggableInstance) {
            this.draggableInstance.update();
          }
        },
        onComplete: () => {
          this.currentIndex = newIndex;
          this.updateButtonStates();
        }
      });
    } else {
      gsap.set(this.track, { x: clampedX });
      this.currentIndex = newIndex;
      this.updateButtonStates();
    }
  }
  
  next() {
    if (this.currentIndex < this.cards.length - 1) {
      this.goTo(this.currentIndex + 1);
    }
  }
  
  prev() {
    if (this.currentIndex > 0) {
      this.goTo(this.currentIndex - 1);
    }
  }
  
  snapToNearest() {
    const nearestIndex = this.calculateNearestIndex();
    this.goTo(nearestIndex);
  }
  
  updateButtonStates() {
    if (!this.prevBtn || !this.nextBtn) return;
    
    // Disable prev if at start
    if (this.currentIndex === 0) {
      this.prevBtn.setAttribute('disabled', '');
    } else {
      this.prevBtn.removeAttribute('disabled');
    }
    
    // Disable next if at end
    if (this.currentIndex >= this.cards.length - 1) {
      this.nextBtn.setAttribute('disabled', '');
    } else {
      this.nextBtn.removeAttribute('disabled');
    }
  }
  
  destroy() {
    if (this.draggableInstance) {
      this.draggableInstance.kill();
    }
    
    window.removeEventListener('resize', this.resizeHandler);
    
    log('🧹 Carousel destroyed');
  }
}
