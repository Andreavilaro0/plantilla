/**
 * PortfolioController.js
 * Controlador para portfolio estilo Hannah Miles
 * 
 * Funcionalidades:
 * 1. Animación de entrada: Título → Fotos en cascada
 * 2. Grid 4 columnas responsive con lazy loading
 * 3. Focus mode con GSAP Flip (foto expande, otras → thumbnails)
 * 4. Navegación por teclado (←→ ESC)
 * 5. Scroll infinito con ScrollTrigger
 * 6. Cleanup completo para evitar memory leaks
 */

import obras from '../../data/obras.js'

export class PortfolioController {
  constructor() {
    
    // Estado general
    this.photosPerPage = 12 // 3 filas × 4 columnas
    this.currentPage = 0
    this.allPhotos = obras
    this.isLoading = false
    this.allPhotosLoaded = false
    
    // Animaciones GSAP
    this.timeline = null
    this.scrollTriggers = []
  }

  /**
   * Inicializar controlador
   * Llamado por LifecycleManager al montar la vista
   */
  init() {
    
    // Verificar que GSAP esté disponible
    if (typeof gsap === 'undefined') {
      return
    }
    
    // Verificar que el grid existe
    const grid = document.querySelector('.photos-grid')
    if (!grid) {
      return
    }
    
    // 1. Renderizar batch inicial de fotos
    this.renderInitialPhotos()

    // 2. Setup animación de entrada
    this.setupEntranceAnimation()

    // 3. Setup scroll stage con pinning (efecto Hannah Miles)
    this.setupScrollStage()

    // 4. Setup scroll infinito
    this.setupInfiniteScroll()
  }

  /**
   * Limpiar controlador
   * Llamado por LifecycleManager al desmontar la vista
   */
  cleanup() {
    
    // 1. Matar timeline principal
    if (this.timeline) {
      this.timeline.kill()
      this.timeline = null
    }
    
    // 2. Matar todos los ScrollTriggers
    this.scrollTriggers.forEach(st => {
      if (st && st.kill) {
        st.kill()
      }
    })
    this.scrollTriggers = []
  }

  /**
   * Renderizar batch inicial de fotos (12 fotos)
   */
  renderInitialPhotos() {
    
    const grid = document.querySelector('.photos-grid')
    const start = 0
    const end = this.photosPerPage
    const batch = this.allPhotos.slice(start, end)
    
    batch.forEach((photo, index) => {
      const figure = this.createPhotoElement(photo, index)
      grid.appendChild(figure)
    })
    
    this.currentPage = 1
  }

  /**
   * Crear elemento HTML de foto
   */
  createPhotoElement(photo, index) {
    const figure = document.createElement('figure')
    figure.className = 'photo-item'
    figure.dataset.id = photo.id
    figure.dataset.index = index
    figure.dataset.animated = 'false'
    
    const img = document.createElement('img')
    img.src = photo.src
    img.alt = photo.alt || photo.title
    img.width = photo.width
    img.height = photo.height
    img.loading = 'lazy' // Lazy loading nativo
    
    const figcaption = document.createElement('figcaption')
    figcaption.textContent = `${photo.title} (${photo.year})`
    
    figure.appendChild(img)
    figure.appendChild(figcaption)
    
    return figure
  }

  /**
   * Setup animación de entrada (ScrollTrigger)
   * La animación se dispara cuando el grid entra en viewport
   */
  setupEntranceAnimation() {
    const portfolioSection = document.querySelector('.portfolio-section')
    if (!portfolioSection) {
      return
    }

    // Crear ScrollTrigger que dispara la animación al entrar en viewport
    const entranceTrigger = ScrollTrigger.create({
      trigger: portfolioSection,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        this.playEntranceTimeline()
      }
    })

    this.scrollTriggers.push(entranceTrigger)
  }

  /**
   * Ejecutar timeline de animación de entrada
   */
  playEntranceTimeline() {
    const title = document.querySelector('.bg-title')
    const photos = document.querySelectorAll('.photo-item')

    if (!title || photos.length === 0) {
      return
    }

    // El título ya está controlado por la clase .visible (CSS transition)
    // Solo animamos las fotos

    // Crear timeline
    this.timeline = gsap.timeline({
      defaults: { ease: 'power3.out' }
    })

    // Fotos en cascada con stagger visible
    this.timeline.fromTo(photos,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,  /* 80ms = visible y elegante */
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
          // Marcar fotos iniciales como animadas
          photos.forEach(photo => {
            photo.dataset.animated = 'true'
          })
        }
      }
    )
  }

  /**
   * Setup scroll stage con pinning (efecto Hannah Miles)
   * El título FIXED siempre visible cuando la sección está en viewport
   */
  setupScrollStage() {
    const section = document.querySelector('.portfolio-section')
    const title = document.querySelector('.bg-title')
    const grid = document.querySelector('.photos-grid')

    if (!section || !title || !grid) {
      return
    }

    // 1. VISIBILITY TRIGGER: Mostrar/ocultar título cuando la sección está en viewport
    const visibilityTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 30%',
      end: 'bottom 70%',
      onEnter: () => {
        title.classList.add('visible')
      },
      onLeave: () => {
        title.classList.remove('visible')
      },
      onEnterBack: () => {
        title.classList.add('visible')
      },
      onLeaveBack: () => {
        title.classList.remove('visible')
      },
      markers: false,
      id: 'portfolio-visibility'
    })

    this.scrollTriggers.push(visibilityTrigger)

    // 2. SCROLL-LINKED ANIMATION: Animación del grid vinculada al scroll
    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
        markers: false,
        id: 'portfolio-scroll-anim'
      }
    })

    // Grid aparece con fade + translateY
    scrollTimeline.fromTo(grid,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }
    )

    this.scrollTriggers.push(scrollTimeline.scrollTrigger)
  }

  /**
   * Setup scroll infinito con ScrollTrigger
   */
  setupInfiniteScroll() {
    
    // Crear ScrollTrigger que dispara al llegar al final del grid
    const scrollTrigger = ScrollTrigger.create({
      trigger: '.photos-grid',
      start: 'bottom bottom+=100px',
      onEnter: () => {
        this.loadMorePhotos()
      },
      onLeave: () => {
        // Refresh ScrollTriggers después de cargar contenido
        ScrollTrigger.refresh()
      }
    })
    
    this.scrollTriggers.push(scrollTrigger)
  }

  /**
   * Cargar más fotos (siguiente batch)
   */
  loadMorePhotos() {
    // Prevenir carga múltiple simultánea
    if (this.isLoading) {
      return
    }
    
    // Verificar si quedan fotos por cargar
    const totalLoaded = this.currentPage * this.photosPerPage
    if (totalLoaded >= this.allPhotos.length) {
      this.allPhotosLoaded = true
      this.showEndMessage()
      return
    }
    
    this.isLoading = true
    this.showLoadingIndicator()
    
    // Simular delay de carga (opcional, mejora UX)
    setTimeout(() => {
      this.renderNextBatch()
      this.isLoading = false
      this.hideLoadingIndicator()
    }, 300)
  }

  /**
   * Mostrar loading indicator
   */
  showLoadingIndicator() {
    const indicator = document.querySelector('.loading-indicator')
    if (indicator) {
      indicator.classList.add('active')
    }
  }

  /**
   * Ocultar loading indicator
   */
  hideLoadingIndicator() {
    const indicator = document.querySelector('.loading-indicator')
    if (indicator) {
      indicator.classList.remove('active')
    }
  }

  /**
   * Mostrar mensaje de fin de contenido
   */
  showEndMessage() {
    const endMsg = document.querySelector('.end-message')
    if (endMsg) {
      endMsg.classList.add('visible')
    }
  }

  /**
   * Renderizar siguiente batch de fotos
   */
  renderNextBatch() {
    const grid = document.querySelector('.photos-grid')
    const start = this.currentPage * this.photosPerPage
    const end = start + this.photosPerPage
    const batch = this.allPhotos.slice(start, end)
    
    if (batch.length === 0) return
    
    // Guardar índice de inicio para animación
    const startIndex = start
    
    batch.forEach((photo, i) => {
      const figure = this.createPhotoElement(photo, startIndex + i)
      grid.appendChild(figure)
    })
    
    this.currentPage++
    
    // Animar nuevas fotos
    this.animateNewPhotos(batch.length)
    
    // Refresh ScrollTriggers para nuevas posiciones
    ScrollTrigger.refresh()
  }

  /**
   * Animar nuevas fotos cargadas
   */
  animateNewPhotos(count) {
    // Seleccionar solo las fotos que no han sido animadas
    const newPhotos = document.querySelectorAll('.photo-item[data-animated="false"]')

    if (newPhotos.length === 0) return

    gsap.fromTo(newPhotos,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,  /* 80ms = visible y elegante */
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
          // Marcar como animadas
          newPhotos.forEach(photo => {
            photo.dataset.animated = 'true'
          })
        }
      }
    )
  }
}
