import gsap from 'gsap';

/**
 * ContactCTA - CTA Card para el hero section
 * Tarjeta gigante estilo paul-factory con "DO YOU HAVE AN AWESOME PROJECT?"
 */
export default class ContactCTA {
  constructor(container) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container)
      : container;
    
    if (!this.container) {
      console.error('ContactCTA: Container not found');
      return;
    }
  }

  /**
   * Renderizar el CTA card
   */
  render() {
    const html = `
      <div class="contact-cta-card">
        <div class="cta-content">
          <h3 class="cta-title">ready to start your next project?</h3>
          <p class="cta-subtitle">
            It's the perfect time to get started!
          </p>
          <a href="#contact" class="cta-button">
            <span>CONTACT ME</span>
          </a>
        </div>
      </div>
    `;
    
    this.container.innerHTML = html;
    this.attachEventListeners();
    this.animateEntrance();
  }

  /**
   * Adjuntar event listeners
   */
  attachEventListeners() {
    const button = this.container.querySelector('.cta-button');
    const card = this.container.querySelector('.contact-cta-card');
    
    // Smooth scroll al hacer click
    if (button) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
    
    // Hover effect en la card
    if (card) {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.02,
          duration: 0.4,
          ease: 'power2.out',
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
        });
      });
    }
  }

  /**
   * Animar entrada del CTA
   */
  animateEntrance() {
    const card = this.container.querySelector('.contact-cta-card');
    
    if (card) {
      gsap.from(card, {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.8,
        ease: 'power3.out',
      });
    }
  }
}
