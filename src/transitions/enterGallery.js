/**
 * Enter Gallery Transition - Cinematic Page Transition
 * 3-Act Structure: Commit -> Curtain/Camera Push -> Reveal
 */
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

// Variable para bloqueo
let transitionActive = false;
let initialOverflow = '';

/**
 * Bloquear input del usuario
 */
function lockScroll() {
  initialOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  
  window.addEventListener('wheel', preventDefault, { passive: false });
  window.addEventListener('touchmove', preventDefault, { passive: false });
  window.addEventListener('keydown', preventKeyScroll);
}

/**
 * Desbloquear input del usuario
 */
function unlockScroll() {
  document.body.style.overflow = initialOverflow;
  
  window.removeEventListener('wheel', preventDefault);
  window.removeEventListener('touchmove', preventDefault);
  window.removeEventListener('keydown', preventKeyScroll);
}

function preventDefault(e) {
  e.preventDefault();
}

function preventKeyScroll(e) {
  // Space, PageUp, PageDown, End, Home, Arrows
  const keys = [' ', 'PageUp', 'PageDown', 'End', 'Home', 'ArrowUp', 'ArrowDown'];
  if (keys.includes(e.key)) {
    e.preventDefault();
  }
}

/**
 * Transición Principal
 */
export function enterGallery() {
  console.log('🎬 Iniciando Cinematic Transition');

  // 1. Check double trigger
  if (transitionActive) return;
  transitionActive = true;

  // 2. Lock Inputs
  lockScroll();
  const enterBtn = document.querySelector('.hero-enter');
  if (enterBtn) enterBtn.disabled = true;

  // Selectores
  const hero = document.querySelector('#hero');
  const heroTitle = document.querySelector('#hero-title'); // o .hero-title-shell
  const heroBg = document.querySelector('.hero-bg');
  const floats = document.querySelectorAll('.hero-float');
  const wrapper = document.querySelector('#app'); // Global wrapper para efecto cámara
  const curtain = document.querySelector('#transition-curtain');
  const mainGallery = document.querySelector('#gallery-field');

  // Master Timeline
  const tl = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    onComplete: () => {
      console.log('✅ Transition Complete');
      transitionActive = false;
      unlockScroll();
      if (enterBtn) enterBtn.disabled = false;
      ScrollTrigger.refresh();
      
      // Cleanup visual curtain (moverlo fuera por si acaso)
      if (curtain) gsap.set(curtain, { bottom: '-110%' });
    }
  });

  // ============================================
  // ACTO 1: COMMIT (0% - 25%)
  // Ambiente se intensifica, título se va
  // ============================================
  
  // Button press effect
  tl.to(enterBtn, { scale: 0.95, duration: 0.1, ease: 'power1.out' })
    .to(enterBtn, { scale: 1, duration: 0.2, opacity: 0 }, '>');

  // Hero Title Compression
  if (heroTitle) {
    tl.to(heroTitle, {
      scale: 0.96,
      y: -18,
      opacity: 0,
      duration: 0.5
    }, 0);
  }

  // Floats "float away" subtly
  if (floats.length) {
    floats.forEach((f, i) => {
      tl.to(f, {
        y: gsap.utils.random(-20, 20),
        rotation: gsap.utils.random(-2, 2),
        opacity: 0.6,
        duration: 0.5
      }, 0);
    });
  }

  // Bg intensity
  if (heroBg) {
    tl.to(heroBg, {
      scale: 1.1,
      filter: 'blur(6px)', // Solo blur al fondo
      duration: 0.6
    }, 0);
  }

  // ============================================
  // ACTO 2: CAMERA PUSH + CURTAIN (25% - 75%)
  // ============================================
  
  // Curtain Rises (Wipe)
  if (curtain) {
    tl.to(curtain, {
      bottom: '0%', // Cubre la pantalla
      duration: 0.7,
      ease: 'power4.inOut'
    }, 0.25);
  }

  // Camera Push (Simulado en wrapper)
  if (wrapper) {
    tl.to(wrapper, {
      scale: 1.08,
      y: -120, // Push visual hacia arriba
      duration: 0.8
    }, 0.2);
  }

  // Hide Hero completely mid-curtain
  if (hero) {
    tl.set(hero, { opacity: 0 }, 0.65);
  }

  // Prepare Main Gallery (Invisible yet)
  if (mainGallery) {
    tl.set(mainGallery, { opacity: 0, y: 60 }, 0.65);
  }

  // ============================================
  // ACTO 3: REVEAL MAIN + SETTLE (75% - 100%)
  // ============================================

  // Ensure main exists logic (basic check)
  // En este punto mainGallery ya debería estar renderizado por HomeView estático

  // Scroll "instantáneo" pero oculto detrás de la cortina o justo antes de bajar
  tl.add(() => {
    if (mainGallery) {
      // Usar window.scrollTo o GSAP scrollTo plugin para ir al inicio de la galería
      gsap.set(window, { scrollTo: { y: mainGallery, offsetY: 0 } });
    }
  }, 0.8);

  // Reveal Main
  if (mainGallery) {
    tl.to(mainGallery, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, 0.85);
  }

  // Curtain Drops/Fades out (Move visual focus)
  // Opción A: Curtain sigue subiendo (desaparece por arriba)
  // Opción B: Curtain baja (reveals) - user pidió "bajar curtain"
  if (curtain) {
    tl.to(curtain, {
      bottom: '-110%', // Baja para revelar
      duration: 0.8,
      ease: 'power3.inOut'
    }, 0.85);
  }

  // Wrapper Settle (Camera stabilize)
  if (wrapper) {
    tl.to(wrapper, {
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, 0.85);
  }

  console.log('⏱️ Transition Duration:', tl.duration());
}

/**
 * Bind Helper
 */
let abortController = null;

export function bindEnterGalleryButton(rootEl) {
  if (abortController) abortController.abort();
  abortController = new AbortController();

  const btn = rootEl.querySelector('.hero-enter');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      enterGallery();
    }, { signal: abortController.signal });
    console.log('✅ Enter Gallery Bound');
  }
}
