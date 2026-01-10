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
    this.handlePhotoClick = this.onPhotoClick.bind(this)
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

    // 3. Setup scroll stage con pinning (efecto Hannah Miles)
    this.setupScrollStage()

    // 4. Setup scroll infinito
    this.setupInfiniteScroll()

    // 5. Setup event delegation para focus mode
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
    
    // 5. Limpiar thumbnails y sus listeners
    const thumbnails = document.querySelectorAll('.thumbnail')
    thumbnails.forEach(thumb => {
      thumb.removeEventListener('click', this.handleThumbnailClick)
    })
    
    const thumbnailsContainer = document.querySelector('.thumbnails-container')
    if (thumbnailsContainer) {
      thumbnailsContainer.innerHTML = ''
    }
    
    // 6. Remover event delegation del grid
    const grid = document.querySelector('.photos-grid')
    if (grid) {
      grid.removeEventListener('click', this.handlePhotoClick)
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
    
    // No agregar listener individual - usamos event delegation
    
    return figure
  }

  /**
   * Setup animación de entrada (ScrollTrigger)
   * La animación se dispara cuando el grid entra en viewport
   */
  setupEntranceAnimation() {
    console.log('[PortfolioController] Setup animación de entrada...')

    const portfolioSection = document.querySelector('.portfolio-section')
    if (!portfolioSection) {
      console.warn('[PortfolioController] Sección de portfolio no encontrada')
      return
    }

    // Crear ScrollTrigger que dispara la animación al entrar en viewport
    const entranceTrigger = ScrollTrigger.create({
      trigger: portfolioSection,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        console.log('[PortfolioController] Portfolio entra en viewport, iniciando animación...')
        this.playEntranceTimeline()
      }
    })

    this.scrollTriggers.push(entranceTrigger)
    console.log('[PortfolioController] Animación de entrada configurada ✓')
  }

  /**
   * Ejecutar timeline de animación de entrada
   */
  playEntranceTimeline() {
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

    // Paso 1: Fade in del título (opacity muy baja para efecto tenue)
    this.timeline.fromTo(title,
      { opacity: 0, scale: 0.95 },
      { opacity: 0.08, scale: 1, duration: 1.2, ease: 'power3.out' }
    )

    // Paso 2: Fotos en cascada
    this.timeline.fromTo(photos,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
          // Marcar fotos iniciales como animadas
          photos.forEach(photo => {
            photo.dataset.animated = 'true'
          })
        }
      },
      '-=0.5'
    )

    console.log('[PortfolioController] Animación de entrada ejecutada ✓')
  }

  /**
   * Setup scroll stage con pinning (efecto Hannah Miles)
   * Crea momento dramático donde la sección se ancla durante el scroll
   */
  setupScrollStage() {
    console.log('[PortfolioController] Setup scroll stage con pinning...')

    const section = document.querySelector('.portfolio-section')
    const title = document.querySelector('.bg-title')
    const grid = document.querySelector('.photos-grid')

    if (!section || !title || !grid) {
      console.warn('[PortfolioController] Elementos para stage no encontrados')
      return
    }

    // 1. PIN: Anclar la sección durante 100vh de scroll
    const pinTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=100vh',
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      markers: false,
      id: 'portfolio-pin'
    })

    this.scrollTriggers.push(pinTrigger)

    // 2. SCROLL-LINKED ANIMATION: Animación vinculada al scroll
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

    // Fase 1: Título aparece con fade + scale
    scrollTimeline.fromTo(title,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 0.08,
        scale: 1,
        duration: 1,
        ease: 'power2.out'
      }
    )

    // Fase 2: Grid aparece con fade + translateY
    scrollTimeline.fromTo(grid,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      },
      '-=0.5'
    )

    this.scrollTriggers.push(scrollTimeline.scrollTrigger)

    console.log('[PortfolioController] Scroll stage configurado ✓')
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
      onLeave: () => {
        // Refresh ScrollTriggers después de cargar contenido
        ScrollTrigger.refresh()
      }
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
      this.showEndMessage()
      return
    }
    
    this.isLoading = true
    this.showLoadingIndicator()
    console.log('[PortfolioController] Cargando más fotos...')
    
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
    
    console.log(`[PortfolioController] Cargadas ${batch.length} fotos más`)
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
        stagger: 0.05,
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

    console.log(`[PortfolioController] Animadas ${count} fotos nuevas`)
  }

  /**
   * Setup focus mode handlers
   */
  setupFocusMode() {
    console.log('[PortfolioController] Setup focus mode...')
    
    // Event delegation: un solo listener en el grid
    const grid = document.querySelector('.photos-grid')
    if (grid) {
      grid.addEventListener('click', this.handlePhotoClick)
    }
    
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
   * Usando GSAP timeline (NO Flip, causa jitter con position:fixed)
   */
  openFocusMode(photoElement, index) {
    console.log(`[PortfolioController] Abriendo focus mode para foto ${index}`)
    
    // Prevenir múltiples aperturas
    if (this.focusState.isOpen) return
    
    const overlay = document.querySelector('.focus-overlay')
    const allPhotos = document.querySelectorAll('.photo-item')
    const otherPhotos = Array.from(allPhotos).filter(p => p !== photoElement)
    
    // Aplicar clase 'focused' a la foto clicada
    photoElement.classList.add('focused')
    
    // Mostrar overlay
    overlay.classList.add('active')
    overlay.setAttribute('aria-hidden', 'false')
    
    // Crear thumbnails
    this.createThumbnails(index)
    
    // Animación con timeline (NO Flip)
    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' }
    })
    
    // Fade out otras fotos
    tl.to(otherPhotos, {
      opacity: 0,
      duration: 0.3
    }, 0)
    
    // Fade in overlay
    tl.to(overlay, {
      opacity: 1,
      duration: 0.4
    }, 0)
    
    // La foto focused ya tiene position:fixed aplicado por CSS
    // Solo necesitamos animar su opacidad si es necesario
    tl.fromTo(photoElement,
      { opacity: 0.8 },
      { opacity: 1, duration: 0.4 },
      0.2
    )
    
    // Update estado
    this.focusState = {
      isOpen: true,
      currentIndex: index,
      focusedElement: photoElement
    }
    
    console.log('[PortfolioController] Focus mode abierto ✓')
  }

  /**
   * Crear thumbnails navegables
   */
  createThumbnails(activeIndex) {
    const container = document.querySelector('.thumbnails-container')
    container.innerHTML = '' // Limpiar
    container.setAttribute('role', 'navigation')
    container.setAttribute('aria-label', 'Photo thumbnails')
    
    // Obtener todas las fotos renderizadas
    const allPhotos = document.querySelectorAll('.photo-item')
    
    allPhotos.forEach((photo, i) => {
      const thumbnail = document.createElement('div')
      thumbnail.className = 'thumbnail'
      if (i === activeIndex) {
        thumbnail.classList.add('active')
      }
      
      thumbnail.dataset.index = i
      thumbnail.setAttribute('role', 'button')
      thumbnail.setAttribute('tabindex', '0')
      thumbnail.setAttribute('aria-label', `View photo ${i + 1}`)
      
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
    const focused = document.querySelector('.photo-item.focused')
    const allPhotos = document.querySelectorAll('.photo-item')
    
    // Matar todas las animaciones en curso
    gsap.killTweensOf([overlay, thumbnailsContainer, '.photo-item'])
    
    if (!animated) {
      // Cleanup inmediato (para navegación SPA)
      if (focused) {
        focused.classList.remove('focused')
      }
      overlay.classList.remove('active')
      overlay.setAttribute('aria-hidden', 'true')
      thumbnailsContainer.classList.remove('active')
      thumbnailsContainer.innerHTML = ''
      // Resetear opacidad de todas las fotos
      gsap.set(allPhotos, { opacity: 1 })
      this.focusState.isOpen = false
      return
    }
    
    // Animación con timeline
    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        overlay.classList.remove('active')
        overlay.setAttribute('aria-hidden', 'true')
        thumbnailsContainer.classList.remove('active')
        thumbnailsContainer.innerHTML = ''
      }
    })
    
    // Remover clase focused primero
    if (focused) {
      focused.classList.remove('focused')
    }
    
    // Fade out overlay y thumbnails
    tl.to([overlay, thumbnailsContainer], {
      opacity: 0,
      duration: 0.3
    }, 0)
    
    // Fade in todas las fotos
    tl.to(allPhotos, {
      opacity: 1,
      duration: 0.4,
      stagger: 0.02
    }, 0.1)
    
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
    
    e.stopPropagation()
    
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
    if (e.target === e.currentTarget) {
      this.closeFocusMode()
    }
  }

  onPhotoClick(e) {
    const photoItem = e.target.closest('.photo-item')
    if (photoItem && !this.focusState.isOpen) {
      const index = parseInt(photoItem.dataset.index)
      this.openFocusMode(photoItem, index)
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
