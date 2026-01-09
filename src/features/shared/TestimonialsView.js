/**
 * Testimonials Section
 * Paul Factory inspired testimonials carousel
 */

export function TestimonialsView() {
  const testimonials = [
    {
      quote: "Outstanding creative vision and technical excellence. The photography brought our brand story to life in ways we never imagined.",
      author: "Sarah Johnson",
      position: "Creative Director, Studio XYZ",
      linkedIn: "https://linkedin.com/in/sarahjohnson",
      project: "#portfolio"
    },
    {
      quote: "Incredible attention to detail and a unique perspective on capturing moments. Highly professional and a pleasure to collaborate with!",
      author: "Michael Chen",
      position: "CEO, Tech Innovations Inc",
      linkedIn: "https://linkedin.com/in/michaelchen",
      project: "#portfolio"
    },
    {
      quote: "The final results exceeded all expectations. A true artist with the camera who understands both aesthetics and storytelling.",
      author: "Emma Davis",
      position: "Marketing Lead, Fashion Co",
      linkedIn: "https://linkedin.com/in/emmadavis",
      project: "#portfolio"
    }
  ];

  const cardsHTML = testimonials.map(t => `
    <div class="testimonial-card">
      <blockquote class="testimonial-quote">"${t.quote}"</blockquote>
      <div class="testimonial-author">
        <p class="author-name">${t.author}</p>
        <p class="author-position">${t.position}</p>
        <div class="testimonial-footer">
          <a href="${t.linkedIn}" class="linkedin-link" target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
            LinkedIn
          </a>
          <a href="${t.project}" class="project-link">See related project →</a>
        </div>
      </div>
    </div>
  `).join('');

  return `
    <section id="testimonials" class="testimonials-section" data-bounce-section>
      <div class="container-wrapper">
        <h2 class="section-title">
          <span class="word">Very</span>
          <span class="word">satisfied</span>
          <span class="word">customers</span>
        </h2>
        
        <div class="testimonials-carousel">
          <div class="carousel-track">
            ${cardsHTML}
          </div>
          
          <div class="carousel-controls">
            <button class="carousel-btn prev" aria-label="Previous testimonial">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button class="carousel-btn next" aria-label="Next testimonial">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}
