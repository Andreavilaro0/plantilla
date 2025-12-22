/**
 * Hero Animations - Timeline + Floating Loops
 */
import { gsap } from 'gsap';

export function initHeroAnimations() {
  const heroText = document.querySelector('.hero-text');
  const heroImages = document.querySelectorAll('.hero-float-img');
  
  if (!heroText || heroImages.length === 0) return;
  
  // Timeline principal para entrada del hero
  const tl = gsap.timeline({ delay: 0.2 });
  
  // Animar texto del hero
  tl.from(heroText.querySelectorAll('h1'), {
    opacity: 0,
    y: 120,
    duration: 1.4,
    stagger: 0.25,
    ease: 'power3.out'
  });
  
  // Animar subtítulo si existe
  const subtitle = heroText.querySelector('p');
  if (subtitle) {
    tl.from(subtitle, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.6');
  }
  
  // Entrada de imágenes flotantes
  tl.from(heroImages, {
    scale: 0,
    opacity: 0,
    duration: 1.8,
    stagger: {
      amount: 0.6,
      from: 'random'
    },
    ease: 'elastic.out(1, 0.7)'
  }, '-=1.2');
  
  // Floating loops infinitos para cada imagen
  heroImages.forEach((img, index) => {
    // Movimiento vertical suave
    gsap.to(img, {
      y: `random(-15, 15)`,
      duration: `random(4, 7)`,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.2
    });
    
    // Rotación sutil
    gsap.to(img, {
      rotation: `random(-3, 3)`,
      duration: `random(5, 8)`,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.15
    });
    
    // Escala pulsante muy sutil
    gsap.to(img, {
      scale: `random(0.98, 1.02)`,
      duration: `random(3, 5)`,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.3
    });
  });
  
  // Parallax en scroll para hero images
  heroImages.forEach((img) => {
    const speed = parseFloat(img.dataset.parallaxSpeed) || 2;
    
    gsap.to(img, {
      y: `+=${speed * 150}`,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}
