// ContactModal.js
// Modal de contacto con estilo azul inspirado en ContactView

import { log } from '@/utils/logger.js';

export class ContactModal {
  constructor() {
    this.isOpen = false;
    this.modal = null;
  }

  render() {
    const modalHTML = `
      <div id="contact-modal" class="contact-modal" style="display: none;">
        <div class="contact-modal-overlay" id="contact-modal-overlay"></div>
        <div class="contact-modal-content">
          <button class="contact-modal-close" id="contact-modal-close" aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div class="contact-modal-inner">
            <h2 class="contact-modal-title">Let's Work Together</h2>
            <p class="contact-modal-subtitle">Get in touch to discuss your next project</p>
            
            <form class="contact-modal-form" id="contact-modal-form">
              <div class="form-group">
                <label for="modal-name">Name</label>
                <input type="text" id="modal-name" name="name" placeholder="Your name" required>
              </div>
              
              <div class="form-group">
                <label for="modal-email">Email</label>
                <input type="email" id="modal-email" name="email" placeholder="your@email.com" required>
              </div>
              
              <div class="form-group">
                <label for="modal-message">Message</label>
                <textarea id="modal-message" name="message" rows="5" placeholder="Tell me about your project..." required></textarea>
              </div>
              
              <button type="submit" class="contact-modal-submit">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    `;
    
    // Insert modal into body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('contact-modal');
    
    // Setup event listeners for close button and overlay
    this.setupEventListeners();
    
    // Setup form handler
    this.setupFormHandler();
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }
  
  setupEventListeners() {
    // Close button
    const closeBtn = document.getElementById('contact-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
    
    // Overlay click to close
    const overlay = document.getElementById('contact-modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => this.close());
    }
  }

  setupFormHandler() {
    const form = document.getElementById('contact-modal-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        log('Form submitted:', {
          name: form.name.value,
          email: form.email.value,
          message: form.message.value
        });
        // You can add actual form submission logic here
        alert('Message sent! (This is a demo)');
        this.close();
        form.reset();
      });
    }
  }

  open() {
    if (!this.modal) this.render();
    this.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    this.isOpen = true;
    
    // Animate in
    requestAnimationFrame(() => {
      this.modal.classList.add('active');
    });
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    this.isOpen = false;
    
    setTimeout(() => {
      this.modal.style.display = 'none';
    }, 300);
  }
}

export default ContactModal;
