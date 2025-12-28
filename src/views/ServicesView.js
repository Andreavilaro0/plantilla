import VanillaTilt from '../lib/vanilla-tilt.js';

const ServicesView = () => {
  // Initialize VanillaTilt after DOM is ready
  setTimeout(() => {
    const cards = document.querySelectorAll('.tilt-card');
    if (cards.length > 0) {
      VanillaTilt.init(cards, {
        max: 25,
        speed: 400,
        glare: true,
        'max-glare': 1,
      });
      console.log('✨ VanillaTilt initialized on', cards.length, 'cards');
    }
  }, 100);

  return `
    <div class="services-view">
      <h1 class="services-title">Our Services</h1>
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
  `;
};

export default ServicesView;
