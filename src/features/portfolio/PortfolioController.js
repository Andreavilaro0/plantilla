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
    console.log('[PortfolioController] Constructor inicializado')
    
    // Estado general
    this.photosPerPage = 12 // 3 filas × 4 columnas
    this.currentPage = 0
    this.allPhotos = obras
    this.isLoading = false
    this.allPhotosLoaded = false
    
    // Animaciones GSAP
    this.timeline = null
    this.scrollTriggers = []
    
    // Focus mode state
    this.focusState = {
      isOpen: false,
      currentIndex: null,
      focusedElement: null
    }
    
    // Bind methods para event listeners
    this.handleKeydown = this.onKeydown.bind(this)
    this.handleOverlayClick = this.onOverlayClick.bind(this)
    this.handleThumbnailClick = this.onThumbnailClick.bind(this)
  }

  /**
   * Inicializar controlador
   * Llamado por LifecycleManager al montar la vista
   */
  init() {
    console.log('[PortfolioController] Inicializando...')
    
    // Verificar que GSAP esté disponible
    if (typeof gsap === 'undefined') {
      console.error('[PortfolioController] GSAP no está disponible!')
      return
    }
    
    // Verificar que el grid existe
    const grid = document.querySelector('.photos-grid')
    if (!grid) {
      console.error('[PortfolioController] Grid no encontrado!')
      return
    }
    
    // 1. Renderizar batch inicial de fotos
    this.renderInitialPhotos()
    
    // 2. Setup animación de entrada
    this.setupEntranceAnimation()
    
    // 3. Setup scroll infinito
    this.setupInfiniteScroll()
    
    // 4. Setup click handlers para focus mode
    this.setupFocusMode()
    
    console.log('[PortfolioController] Inicializado ✓')
  }

  /**
   * Limpiar controlador
   * Llamado por LifecycleManager al desmontar la vista
   */
  cleanup() {
    console.log('[PortfolioController] Limpiando recursos...')
    
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
    
    // 3. Remover event listeners
    document.removeEventListener('keydown', this.handleKeydown)
    
    const overlay = document.querySelector('.focus-overlay')
    if (overlay) {
      overlay.removeEventListener('click', this.handleOverlayClick)
    }
    
    // 4. Cerrar focus mode si está activo (sin animación)
    if (this.focusState.isOpen) {
      this.closeFocusMode(false)
    }
    
    // 5. Limpiar thumbnails
    const thumbnailsContainer = document.querySelector('.thumbnails-container')
    if (thumbnailsContainer) {
      thumbnailsContainer.innerHTML = ''
    }
    
    console.log('[PortfolioController] Limpiado ✓')
  }

  /**
   * Renderizar batch inicial de fotos (12 fotos)
   */
  renderInitialPhotos() {
    console.log('[PortfolioController] Renderizando fotos iniciales...')
    
    const grid = document.querySelector('.photos-grid')
    const start = 0
    const end = this.photosPerPage
    const batch = this.allPhotos.slice(start, end)
    
    batch.forEach((photo, index) => {
      const figure = this.createPhotoElement(photo, index)
      grid.appendChild(figure)
    })
    
    this.currentPage = 1
    console.log(`[PortfolioController] Renderizadas ${batch.length} fotos`)
  }

  /**
   * Crear elemento HTML de foto
   */
  createPhotoElement(photo, index) {
    const figure = document.createElement('figure')
    figure.className = 'photo-item'
    figure.dataset.id = photo.id
    figure.dataset.index = index
    
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
    
    // Click handler para abrir focus mode
    figure.addEventListener('click', () => this.openFocusMode(figure, index))
    
    return figure
  }

  /**
   * Setup animación de entrada (Timeline GSAP)
   * 1. Título aparece (1s)
   * 2. Fotos aparecen en cascada (0.5s después)
   */
  setupEntranceAnimation() {
    console.log('[PortfolioController] Setup animación de entrada...')

    const title = document.querySelector('.bg-title')
    const photos = document.querySelectorAll('.photo-item')

    if (!title || photos.length === 0) {
      console.warn('[PortfolioController] Elementos para animar no encontrados')
      return
    }

    // Crear timeline
    this.timeline = gsap.timeline({
      defaults: { ease: 'power3.out' }
    })

    // Paso 1: Fade in del título (usando fromTo para control total)
    this.timeline.fromTo(title,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1 }
    )

    // Paso 2: Fotos en cascada (empieza 0.5s antes del final del título)
    this.timeline.fromTo(photos,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.8 },
      '-=0.5'
    )

    console.log('[PortfolioController] Animación de entrada configurada ✓')
  }

  /**
   * Setup scroll infinito con ScrollTrigger
   */
  setupInfiniteScroll() {
    console.log('[PortfolioController] Setup scroll infinito...')
    
    // Crear ScrollTrigger que dispara al llegar al final del grid
    const scrollTrigger = ScrollTrigger.create({
      trigger: '.photos-grid',
      start: 'bottom bottom+=100px',
      onEnter: () => {
        console.log('[PortfolioController] Scroll trigger activado')
        this.loadMorePhotos()
      },
      // Si usas Lenis, descomenta esto:
      // scroller: '[data-scroll-container]'
    })
    
    this.scrollTriggers.push(scrollTrigger)
    console.log('[PortfolioController] Scroll infinito configurado ✓')
  }

  /**
   * Cargar más fotos (siguiente batch)
   */
  loadMorePhotos() {
    // Prevenir carga múltiple simultánea
    if (this.isLoading) {
      console.log('[PortfolioController] Ya cargando fotos...')
      return
    }
    
    // Verificar si quedan fotos por cargar
    const totalLoaded = this.currentPage * this.photosPerPage
    if (totalLoaded >= this.allPhotos.length) {
      console.log('[PortfolioController] Todas las fotos cargadas')
      this.allPhotosLoaded = true
      return
    }
    
    this.isLoading = true
    console.log('[PortfolioController] Cargando más fotos...')
    
    // Simular delay de carga (opcional, mejora UX)
    setTimeout(() => {
      this.renderNextBatch()
      this.isLoading = false
    }, 300)
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
    
    console.log(`[PortfolioController] Cargadas ${batch.length} fotos más`)
  }

  /**
   * Animar nuevas fotos cargadas
   */
  animateNewPhotos(count) {
    const allPhotos = Array.from(document.querySelectorAll('.photo-item'))
    const newPhotos = allPhotos.slice(-count) // Últimas 'count' fotos

    gsap.fromTo(newPhotos,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out' }
    )
  }

  /**
   * Setup focus mode handlers
   */
  setupFocusMode() {
    console.log('[PortfolioController] Setup focus mode...')
    
    // Click en overlay cierra focus mode
    const overlay = document.querySelector('.focus-overlay')
    if (overlay) {
      overlay.addEventListener('click', this.handleOverlayClick)
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeydown)
    
    console.log('[PortfolioController] Focus mode configurado ✓')
  }

  /**
   * Abrir focus mode (foto expande, otras → thumbnails)
   */
  openFocusMode(photoElement, index) {
    console.log(`[PortfolioController] Abriendo focus mode para foto ${index}`)
    
    // Prevenir múltiples aperturas
    if (this.focusState.isOpen) return
    
    // Guardar estado con GSAP Flip
    const state = Flip.getState('.photo-item')
    
    // Aplicar clase 'focused' a la foto clicada
    photoElement.classList.add('focused')
    
    // Mostrar overlay
    const overlay = document.querySelector('.focus-overlay')
    overlay.classList.add('active')
    
    // Crear thumbnails
    this.createThumbnails(index)
    
    // Animar transición con Flip
    Flip.from(state, {
      duration: 0.6,
      ease: 'power3.inOut',
      absolute: true,
      scale: true,
      onComplete: () => {
        console.log('[PortfolioController] Focus mode abierto ✓')
      }
    })
    
    // Fade in del overlay
    gsap.to(overlay, {
      opacity: 1,
      duration: 0.4
    })
    
    // Update estado
    this.focusState = {
      isOpen: true,
      currentIndex: index,
      focusedElement: photoElement
    }
  }

  /**
   * Crear thumbnails navegables
   */
  createThumbnails(activeIndex) {
    const container = document.querySelector('.thumbnails-container')
    container.innerHTML = '' // Limpiar
    
    // Obtener todas las fotos renderizadas
    const allPhotos = document.querySelectorAll('.photo-item')
    
    allPhotos.forEach((photo, i) => {
      const thumbnail = document.createElement('div')
      thumbnail.className = 'thumbnail'
      if (i === activeIndex) {
        thumbnail.classList.add('active')
      }
      
      thumbnail.dataset.index = i
      
      const img = document.createElement('img')
      img.src = photo.querySelector('img').src
      img.alt = photo.querySelector('img').alt
      
      thumbnail.appendChild(img)
      thumbnail.addEventListener('click', this.handleThumbnailClick)
      
      container.appendChild(thumbnail)
    })
    
    // Mostrar container
    container.classList.add('active')
    
    // Auto-scroll al thumbnail activo
    const activeThumbnail = container.querySelector('.thumbnail.active')
    if (activeThumbnail) {
      activeThumbnail.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      })
    }
  }

  /**
   * Cerrar focus mode
   */
  closeFocusMode(animated = true) {
    console.log('[PortfolioController] Cerrando focus mode...')
    
    if (!this.focusState.isOpen) return
    
    const overlay = document.querySelector('.focus-overlay')
    const thumbnailsContainer = document.querySelector('.thumbnails-container')
    
    if (!animated) {
      // Cleanup inmediato (para navegación SPA)
      const focused = document.querySelector('.photo-item.focused')
      if (focused) {
        focused.classList.remove('focused')
      }
      overlay.classList.remove('active')
      thumbnailsContainer.classList.remove('active')
      thumbnailsContainer.innerHTML = ''
      this.focusState.isOpen = false
      return
    }
    
    // Guardar estado actual
    const state = Flip.getState('.photo-item')
    
    // Remover clases
    const focused = document.querySelector('.photo-item.focused')
    if (focused) {
      focused.classList.remove('focused')
    }
    
    // Animar regreso con Flip
    Flip.from(state, {
      duration: 0.6,
      ease: 'power3.inOut',
      absolute: true,
      scale: true
    })
    
    // Fade out overlay y thumbnails
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        overlay.classList.remove('active')
      }
    })
    
    gsap.to(thumbnailsContainer, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        thumbnailsContainer.classList.remove('active')
        thumbnailsContainer.innerHTML = ''
      }
    })
    
    // Reset estado
    this.focusState = {
      isOpen: false,
      currentIndex: null,
      focusedElement: null
    }
    
    console.log('[PortfolioController] Focus mode cerrado ✓')
  }

  /**
   * Cambiar a foto específica en focus mode
   */
  showPhoto(index) {
    console.log(`[PortfolioController] Mostrando foto ${index}`)
    
    const allPhotos = document.querySelectorAll('.photo-item')
    if (index < 0 || index >= allPhotos.length) return
    
    const focused = document.querySelector('.photo-item.focused')
    const nextPhoto = allPhotos[index]
    
    if (!focused || !nextPhoto) return
    
    // Fade out imagen actual
    gsap.to(focused.querySelector('img'), {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        // Swap focused class
        focused.classList.remove('focused')
        nextPhoto.classList.add('focused')
        
        // Fade in nueva imagen
        gsap.fromTo(nextPhoto.querySelector('img'),
          { opacity: 0 },
          { opacity: 1, duration: 0.3 }
        )
        
        // Update thumbnails
        this.updateActiveThumbnail(index)
        
        // Update estado
        this.focusState.currentIndex = index
        this.focusState.focusedElement = nextPhoto
      }
    })
  }

  /**
   * Actualizar thumbnail activo
   */
  updateActiveThumbnail(index) {
    const thumbnails = document.querySelectorAll('.thumbnail')
    thumbnails.forEach((thumb, i) => {
      if (i === index) {
        thumb.classList.add('active')
        // Auto-scroll
        thumb.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        })
      } else {
        thumb.classList.remove('active')
      }
    })
  }

  /**
   * Event Handlers
   */
  
  onKeydown(e) {
    if (!this.focusState.isOpen) return
    
    switch(e.key) {
      case 'Escape':
        e.preventDefault()
        this.closeFocusMode()
        break
        
      case 'ArrowLeft':
        e.preventDefault()
        this.navigateToPrevious()
        break
        
      case 'ArrowRight':
        e.preventDefault()
        this.navigateToNext()
        break
        
      case 'Home':
        e.preventDefault()
        this.showPhoto(0)
        break
        
      case 'End':
        e.preventDefault()
        const allPhotos = document.querySelectorAll('.photo-item')
        this.showPhoto(allPhotos.length - 1)
        break
    }
  }

  onOverlayClick(e) {
    if (e.target.classList.contains('focus-overlay')) {
      this.closeFocusMode()
    }
  }

  onThumbnailClick(e) {
    const thumbnail = e.currentTarget
    const index = parseInt(thumbnail.dataset.index)
    this.showPhoto(index)
  }

  /**
   * Navegación por teclado
   */
  
  navigateToPrevious() {
    const prevIndex = this.focusState.currentIndex - 1
    const allPhotos = document.querySelectorAll('.photo-item')
    
    if (prevIndex < 0) {
      // Loop al final
      this.showPhoto(allPhotos.length - 1)
    } else {
      this.showPhoto(prevIndex)
    }
  }

  navigateToNext() {
    const nextIndex = this.focusState.currentIndex + 1
    const allPhotos = document.querySelectorAll('.photo-item')
    
    if (nextIndex >= allPhotos.length) {
      // Loop al inicio
      this.showPhoto(0)
    } else {
      this.showPhoto(nextIndex)
    }
  }
}
