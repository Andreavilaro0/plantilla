/**
 * Scroll Animations - Enhanced cinematic reveals
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  const galleryWrappers = document.querySelectorAll('.photo-card');
  
  if (galleryWrappers.length === 0) return;
  
  // Agrupar cards por banda
  const cardsByBand = groupByBand(galleryWrappers);
  
  // Animar cada banda con efectos cinematográficos mejorados
  Object.entries(cardsByBand).forEach(([bandIndex, cards], groupIndex) => {
    // Alternar dirección de entrada por banda
    const direction = groupIndex % 2 === 0 ? 1 : -1;
    
    cards.forEach((card, index) => {
      // Variación de efectos por posición
      const isLeft = index % 3 === 0;
      const isCenter = index % 3 === 1;
      const isRight = index % 3 === 2;
      
      // Configuración de animación personalizada
      const animConfig = {
        opacity: 0,
        scale: 0.75,
        rotation: direction * (isLeft ? -8 : isRight ? 8 : 0),
        y: 120,
        x: direction * (isLeft ? -40 : isRight ? 40 : 0),
        filter: 'blur(8px)',
        duration: 1.4,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'top 60%',
          toggleActions: 'play none none none',
          // markers: true // Debug
        }
      };
      
      gsap.from(card, animConfig);
    });
    
    // Animación adicional para el inner (profundidad)
    const inners = cards.map(card => card.querySelector('.photo-inner')).filter(Boolean);
    if (inners.length > 0) {
      gsap.from(inners, {
        scale: 1.15,
        duration: 1.6,
        ease: 'power2.out',
        stagger: {
          amount: 0.5,
          from: 'random'
        },
        scrollTrigger: {
          trigger: cards[0],
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      });
    }
  });
  
  // Parallax scroll mejorado con efecto de profundidad
  galleryWrappers.forEach((wrapper) => {
    const speed = parseFloat(wrapper.dataset.scrollSpeed) || 0;
    const depth = parseFloat(wrapper.dataset.depth) || 1;
    
    if (speed !== 0) {
      // Parallax vertical
      gsap.to(wrapper, {
        y: speed * 80,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });
      
      // Efecto de escala sutil para profundidad
      gsap.to(wrapper, {
        scale: 1 + (depth * 0.03),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top bottom',
          end: 'center center',
          scrub: 2
        }
      });
    }
  });
  
  // Animación especial para el título "Selected Works"
  const galleryTitle = document.querySelector('#gallery-field h2');
  if (galleryTitle) {
    gsap.from(galleryTitle, {
      opacity: 0,
      y: 60,
      scale: 0.9,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: galleryTitle,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }
  
  // Animación para el contador de fotografías
  const photoCount = document.querySelector('#gallery-field p');
  if (photoCount) {
    gsap.from(photoCount, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.3,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: photoCount,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }
}

/**
 * Agrupa elementos por banda
 */
function groupByBand(elements) {
  const groups = {};
  
  elements.forEach((el) => {
    const band = el.dataset.band || '0';
    if (!groups[band]) {
      groups[band] = [];
    }
    groups[band].push(el);
  });
  
  return groups;
}
