import gsap from 'gsap';
import { log } from '@/utils/logger.js';

/**
 * ThemeToggle - Sistema de modo día/noche
 * Adaptado de paul-factory con color negro en vez de azul
 */
export default class ThemeToggle {
  constructor() {
    this.currentTheme = null;
    this.toggleButton = null;
  }

  /**
   * Inicializar el tema y crear botón toggle
   */
  init() {
    // Detectar preferencia del sistema o localStorage
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    this.currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // Aplicar tema inicial sin transición
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    
    // Crear botón toggle
    this.createToggleButton();
    
    // Escuchar cambios en preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light', false);
      }
    });

    log(`🌓 ThemeToggle initialized (${this.currentTheme} mode)`);
  }

  /**
   * Crear botón toggle en la esquina superior derecha
   */
  createToggleButton() {
    // Verificar si ya existe
    if (document.getElementById('theme-toggle')) return;

    const button = document.createElement('button');
    button.id = 'theme-toggle';
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', 'Toggle dark mode');
    
    // Iconos SVG simples
    const sunIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <circle cx="10" cy="10" r="4"/>
      <path d="M10 0v3M10 17v3M3.5 3.5l2.1 2.1M14.4 14.4l2.1 2.1M0 10h3M17 10h3M3.5 16.5l2.1-2.1M14.4 5.6l2.1-2.1"/>
    </svg>`;
    
    const moonIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.3 13.8a8 8 0 01-11.1-11.1A8 8 0 1017.3 13.8z"/>
    </svg>`;
    
    button.innerHTML = this.currentTheme === 'dark' ? sunIcon : moonIcon;
    
    // Event listener
    button.addEventListener('click', () => this.toggle());
    
    // Renderizar en el contenedor del navbar si existe, sino en body
    const navbarContainer = document.getElementById('theme-toggle-container');
    if (navbarContainer) {
      navbarContainer.appendChild(button);
    } else {
      document.body.appendChild(button);
    }
    
    this.toggleButton = button;
  }

  /**
   * Toggle entre light y dark mode
   */
  toggle() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme, true);
  }

  /**
   * Establecer tema específico
   * @param {string} theme - 'light' o 'dark'
   * @param {boolean} animate - Si debe animar la transición
   */
  setTheme(theme, animate = true) {
    this.currentTheme = theme;
    
    if (animate) {
      // Animar transición suave
      document.documentElement.classList.add('theme-transitioning');
      
      // Animar el botón con rotación
      if (this.toggleButton) {
        gsap.to(this.toggleButton, {
          rotation: '+=180',
          duration: 0.3,
          ease: 'power2.inOut'
        });
      }
      
      gsap.to(document.documentElement, {
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          document.documentElement.classList.remove('theme-transitioning');
        }
      });
    }
    
    // Aplicar tema
    document.documentElement.setAttribute('data-theme', theme);
    
    // Guardar preferencia
    localStorage.setItem('theme', theme);
    
    // Actualizar icono del botón (después de un breve delay para la rotación)
    setTimeout(() => {
      if (this.toggleButton) {
        const sunIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <circle cx="10" cy="10" r="4"/>
          <path d="M10 0v3M10 17v3M3.5 3.5l2.1 2.1M14.4 14.4l2.1 2.1M0 10h3M17 10h3M3.5 16.5l2.1-2.1M14.4 5.6l2.1-2.1"/>
        </svg>`;
        
        const moonIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.3 13.8a8 8 0 01-11.1-11.1A8 8 0 1017.3 13.8z"/>
        </svg>`;
        
        this.toggleButton.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
      }
    }, animate ? 150 : 0);
  }

  /**
   * Destruir instancia
   */
  destroy() {
    if (this.toggleButton) {
      this.toggleButton.remove();
      this.toggleButton = null;
    }
  }
}
