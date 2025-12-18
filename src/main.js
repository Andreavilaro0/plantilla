import './style.css'
import { initScrollAnimations, initSmoothScroll } from './js/animations/scroll.js';

//  RUTAS DEL SITIO - Estilo Lando Norris
const routes = {
  '/': () => `
    <section class="space-y-12">
      <!-- Hero Section -->
      <div class="relative glass-card overflow-hidden" data-animate="fade-up">
        <div class="speed-lines">
          <div class="speed-line" style="width: 200px"></div>
          <div class="speed-line" style="width: 300px"></div>
          <div class="speed-line" style="width: 250px"></div>
          <div class="speed-line" style="width: 350px"></div>
        </div>
        <div class="corner-accent top-left"></div>
        <div class="corner-accent bottom-right"></div>
        
        <div class="relative z-10">
          <h1 class="text-6xl md:text-8xl font-bold gradient-text-blue mb-4" style="font-family: 'Rajdhani', sans-serif;">
            TU NOMBRE
          </h1>
          <h2 class="text-3xl md:text-4xl mb-6" style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif; text-transform: uppercase; letter-spacing: 0.1em;">
            Filmmaker & Photographer
          </h2>
          <p class="text-gray-400 text-lg leading-relaxed max-w-3xl">
            Capturando momentos únicos y creando narrativas visuales que inspiran. 
            Especializado en cinematografía, fotografía comercial y dirección creativa.
          </p>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid md:grid-cols-4 gap-4">
        <div class="glass-card text-center" data-animate="fade-up" style="background: linear-gradient(135deg, rgba(196, 255, 13, 0.1) 0%, rgba(26, 26, 26, 0.9) 100%);">
          <div class="text-5xl font-bold neon-glow mb-2" style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif;">150+</div>
          <div class="text-gray-400 uppercase text-sm tracking-wider">Proyectos</div>
        </div>
        <div class="glass-card text-center" data-animate="fade-up" style="background: linear-gradient(135deg, rgba(196, 255, 13, 0.1) 0%, rgba(26, 26, 26, 0.9) 100%);">
          <div class="text-5xl font-bold neon-glow mb-2" style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif;">8</div>
          <div class="text-gray-400 uppercase text-sm tracking-wider">Premios</div>
        </div>
        <div class="glass-card text-center" data-animate="fade-up" style="background: linear-gradient(135deg, rgba(196, 255, 13, 0.1) 0%, rgba(26, 26, 26, 0.9) 100%);">
          <div class="text-5xl font-bold neon-glow mb-2" style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif;">50+</div>
          <div class="text-gray-400 uppercase text-sm tracking-wider">Clientes</div>
        </div>
        <div class="glass-card text-center" data-animate="fade-up" style="background: linear-gradient(135deg, rgba(196, 255, 13, 0.1) 0%, rgba(26, 26, 26, 0.9) 100%);">
          <div class="text-5xl font-bold neon-glow mb-2" style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif;">5+</div>
          <div class="text-gray-400 uppercase text-sm tracking-wider">Años</div>
        </div>
      </div>

      <!-- Films / Photography -->
      <div class="grid md:grid-cols-2 gap-6">
        <div class="glass-card" data-animate="fade-up">
          <h2 class="text-4xl font-bold mb-6" style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif; text-transform: uppercase;">FILMS</h2>
          <p class="text-gray-300 mb-6">Proyectos cinematográficos y producción audiovisual</p>
          <div class="space-y-4">
            <div class="border-l-4 pl-4" style="border-color: #c4ff0d;">
              <h4 class="text-lg font-bold text-white mb-1">Cortometraje "Eclipse"</h4>
              <p class="text-gray-400 text-sm">Drama • 15 min • 2025</p>
              <div class="flex gap-2 mt-2">
                <span class="px-2 py-1 text-xs" style="background: rgba(196, 255, 13, 0.2); color: #c4ff0d; clip-path: polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%);">DIRECTOR</span>
                <span class="px-2 py-1 text-xs" style="background: rgba(196, 255, 13, 0.2); color: #c4ff0d; clip-path: polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%);">DOP</span>
              </div>
            </div>
            <div class="border-l-4 pl-4" style="border-color: #c4ff0d;">
              <h4 class="text-lg font-bold text-white mb-1">Video Comercial Nike</h4>
              <p class="text-gray-400 text-sm">Publicidad • 30 seg • 2024</p>
              <div class="flex gap-2 mt-2">
                <span class="px-2 py-1 text-xs" style="background: rgba(196, 255, 13, 0.2); color: #c4ff0d; clip-path: polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%);">CINEMATOGRAFÍA</span>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-card" data-animate="fade-up">
          <h2 class="text-4xl font-bold mb-6" style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif; text-transform: uppercase;">PHOTOGRAPHY</h2>
          <p class="text-gray-300 mb-6">Fotografía comercial, editorial y artística</p>
          <div class="space-y-4">
            <div class="border-l-4 pl-4" style="border-color: #8b8b8b;">
              <h4 class="text-lg font-bold text-white mb-1">Campaign Vogue</h4>
              <p class="text-gray-400 text-sm">Editorial de moda</p>
            </div>
            <div class="border-l-4 pl-4" style="border-color: #8b8b8b;">
              <h4 class="text-lg font-bold text-white mb-1">Retratos Corporativos</h4>
              <p class="text-gray-400 text-sm">Fotografía empresarial</p>
            </div>
            <div class="border-l-4 pl-4" style="border-color: #8b8b8b;">
              <h4 class="text-lg font-bold text-white mb-1">Serie "Urban Nights"</h4>
              <p class="text-gray-400 text-sm">Proyecto personal</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Equipment -->
      <div class="glass-card" data-animate="fade-up">
        <h3 class="text-3xl font-bold mb-6" style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif; text-transform: uppercase;">EQUIPMENT</h3>
        <div class="flex flex-wrap gap-3">
          <span class="px-4 py-2 text-sm font-bold" style="background: rgba(196, 255, 13, 0.15); color: #c4ff0d; border: 1px solid rgba(196, 255, 13, 0.3); clip-path: polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%); font-family: 'Rajdhani', sans-serif; letter-spacing: 0.1em;">RED KOMODO</span>
          <span class="px-4 py-2 text-sm font-bold" style="background: rgba(196, 255, 13, 0.15); color: #c4ff0d; border: 1px solid rgba(196, 255, 13, 0.3); clip-path: polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%); font-family: 'Rajdhani', sans-serif; letter-spacing: 0.1em;">SONY A7SIII</span>
          <span class="px-4 py-2 text-sm font-bold" style="background: rgba(196, 255, 13, 0.15); color: #c4ff0d; border: 1px solid rgba(196, 255, 13, 0.3); clip-path: polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%); font-family: 'Rajdhani', sans-serif; letter-spacing: 0.1em;">CANON R5</span>
          <span class="px-4 py-2 text-sm font-bold" style="background: rgba(196, 255, 13, 0.15); color: #c4ff0d; border: 1px solid rgba(196, 255, 13, 0.3); clip-path: polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%); font-family: 'Rajdhani', sans-serif; letter-spacing: 0.1em;">DJI RONIN</span>
          <span class="px-4 py-2 text-sm font-bold" style="background: rgba(196, 255, 13, 0.15); color: #c4ff0d; border: 1px solid rgba(196, 255, 13, 0.3); clip-path: polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%); font-family: 'Rajdhani', sans-serif; letter-spacing: 0.1em;">APUTURE</span>
          <span class="px-4 py-2 text-sm font-bold" style="background: rgba(196, 255, 13, 0.15); color: #c4ff0d; border: 1px solid rgba(196, 255, 13, 0.3); clip-path: polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%); font-family: 'Rajdhani', sans-serif; letter-spacing: 0.1em;">DAVINCI RESOLVE</span>
        </div>
      </div>
    </section>
  `,
  
  '/about': () => `
    <section class="space-y-8">
      <div class="glass-card" data-animate="fade-up">
        <div class="corner-accent top-left"></div>
        <div class="corner-accent bottom-right"></div>
        
        <h1 class="text-5xl md:text-6xl font-bold gradient-text-purple mb-6" style="font-family: 'Rajdhani', sans-serif; text-transform: uppercase;">ABOUT</h1>
        <p class="text-gray-300 text-lg leading-relaxed mb-8">
          Cuento historias a través de la lente. Cada frame es una oportunidad para capturar emociones, crear atmósferas y conectar con la audiencia a un nivel profundo.
        </p>
        
        <!-- Skills -->
        <div class="space-y-6 mt-8">
          <h2 class="text-2xl font-bold mb-6" style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif; text-transform: uppercase;">EXPERTISE</h2>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-white font-bold" style="font-family: 'Rajdhani', sans-serif; text-transform: uppercase;">Cinematografía</span>
                  <span style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif;">95%</span>
                </div>
                <div class="w-full h-2" style="background: #2a2a2a;">
                  <div class="h-2" style="width: 95%; background: linear-gradient(90deg, #c4ff0d 0%, #7fff00 100%); box-shadow: 0 0 10px rgba(196, 255, 13, 0.5);"></div>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-white font-bold" style="font-family: 'Rajdhani', sans-serif; text-transform: uppercase;">Fotografía</span>
                  <span style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif;">92%</span>
                </div>
                <div class="w-full h-2" style="background: #2a2a2a;">
                  <div class="h-2" style="width: 92%; background: linear-gradient(90deg, #c4ff0d 0%, #7fff00 100%); box-shadow: 0 0 10px rgba(196, 255, 13, 0.5);"></div>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-white font-bold" style="font-family: 'Rajdhani', sans-serif; text-transform: uppercase;">Edición / Post</span>
                  <span style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif;">90%</span>
                </div>
                <div class="w-full h-2" style="background: #2a2a2a;">
                  <div class="h-2" style="width: 90%; background: linear-gradient(90deg, #c4ff0d 0%, #7fff00 100%); box-shadow: 0 0 10px rgba(196, 255, 13, 0.5);"></div>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-white font-bold" style="font-family: 'Rajdhani', sans-serif; text-transform: uppercase;">Color Grading</span>
                  <span style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif;">88%</span>
                </div>
                <div class="w-full h-2" style="background: #2a2a2a;">
                  <div class="h-2" style="width: 88%; background: linear-gradient(90deg, #c4ff0d 0%, #7fff00 100%); box-shadow: 0 0 10px rgba(196, 255, 13, 0.5);"></div>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-white font-bold" style="font-family: 'Rajdhani', sans-serif; text-transform: uppercase;">Dirección</span>
                  <span style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif;">85%</span>
                </div>
                <div class="w-full h-2" style="background: #2a2a2a;">
                  <div class="h-2" style="width: 85%; background: linear-gradient(90deg, #c4ff0d 0%, #7fff00 100%); box-shadow: 0 0 10px rgba(196, 255, 13, 0.5);"></div>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-white font-bold" style="font-family: 'Rajdhani', sans-serif; text-transform: uppercase;">Iluminación</span>
                  <span style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif;">93%</span>
                </div>
                <div class="w-full h-2" style="background: #2a2a2a;">
                  <div class="h-2" style="width: 93%; background: linear-gradient(90deg, #c4ff0d 0%, #7fff00 100%); box-shadow: 0 0 10px rgba(196, 255, 13, 0.5);"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Experience -->
      <div class="glass-card" data-animate="fade-up">
        <h3 class="text-3xl font-bold mb-6" style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif; text-transform: uppercase;">EXPERIENCE</h3>
        <div class="space-y-6">
          <div class="border-l-4 pl-6" style="border-color: #c4ff0d;">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-4 h-4 rounded-full" style="background: #c4ff0d; box-shadow: 0 0 10px rgba(196, 255, 13, 0.5);"></div>
              <h4 class="text-xl font-bold text-white" style="font-family: 'Rajdhani', sans-serif;">DIRECTOR OF PHOTOGRAPHY</h4>
            </div>
            <p class="text-gray-400 text-sm mb-2">Independent Productions • 2022 - Presente</p>
            <p class="text-gray-300">Cinematografía para cortometrajes, videoclips y contenido comercial de alta gama</p>
          </div>
          
          <div class="border-l-4 pl-6" style="border-color: #8b8b8b;">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-4 h-4 rounded-full" style="background: #8b8b8b;"></div>
              <h4 class="text-xl font-bold text-white" style="font-family: 'Rajdhani', sans-serif;">PHOTOGRAPHER</h4>
            </div>
            <p class="text-gray-400 text-sm mb-2">Fashion & Editorial • 2020 - Presente</p>
            <p class="text-gray-300">Fotografía para marcas, editoriales de moda y campañas publicitarias</p>
          </div>
          
          <div class="border-l-4 pl-6" style="border-color: #8b8b8b;">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-4 h-4 rounded-full" style="background: #8b8b8b;"></div>
              <h4 class="text-xl font-bold text-white" style="font-family: 'Rajdhani', sans-serif;">EDITOR & COLORIST</h4>
            </div>
            <p class="text-gray-400 text-sm mb-2">Post Production • 2019 - 2022</p>
            <p class="text-gray-300">Edición y color grading para proyectos audiovisuales diversos</p>
          </div>
        </div>
      </div>

      <!-- Awards -->
      <div class="glass-card" data-animate="fade-up">
        <h3 class="text-3xl font-bold mb-6" style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif; text-transform: uppercase;">AWARDS & RECOGNITION</h3>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="p-4" style="border-left: 3px solid #c4ff0d;">
            <h4 class="text-white font-bold mb-1">Best Cinematography</h4>
            <p class="text-gray-400 text-sm">Festival Internacional • 2024</p>
          </div>
          <div class="p-4" style="border-left: 3px solid #c4ff0d;">
            <h4 class="text-white font-bold mb-1">Editorial Photography Award</h4>
            <p class="text-gray-400 text-sm">Photography Awards • 2023</p>
          </div>
          <div class="p-4" style="border-left: 3px solid #8b8b8b;">
            <h4 class="text-white font-bold mb-1">Best Short Film</h4>
            <p class="text-gray-400 text-sm">Regional Film Fest • 2023</p>
          </div>
          <div class="p-4" style="border-left: 3px solid #8b8b8b;">
            <h4 class="text-white font-bold mb-1">Commercial Campaign</h4>
            <p class="text-gray-400 text-sm">Advertising Excellence • 2022</p>
          </div>
        </div>
      </div>
    </section>
  `,
  
  '/contact': () => `
    <section class="space-y-8">
      <div class="glass-card" data-animate="fade-up">
        <div class="corner-accent top-left"></div>
        <div class="corner-accent bottom-right"></div>
        
        <h1 class="text-5xl md:text-6xl font-bold gradient-text-pink mb-6" style="font-family: 'Rajdhani', sans-serif; text-transform: uppercase;">CONTACT</h1>
        <p class="text-gray-300 text-lg leading-relaxed mb-8">
          ¿Tienes un proyecto en mente? Hablemos sobre cómo puedo ayudarte a dar vida a tu visión.
        </p>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div class="glass-card" style="background: linear-gradient(135deg, rgba(196, 255, 13, 0.1) 0%, rgba(26, 26, 26, 0.9) 100%);" data-animate="fade-up">
            <div class="corner-accent top-left"></div>
            <h3 class="text-lg font-bold mb-3" style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif; text-transform: uppercase;">EMAIL</h3>
            <p class="text-white">tu.email@ejemplo.com</p>
          </div>
          
          <div class="glass-card" style="background: linear-gradient(135deg, rgba(196, 255, 13, 0.1) 0%, rgba(26, 26, 26, 0.9) 100%);" data-animate="fade-up">
            <div class="corner-accent top-left"></div>
            <h3 class="text-lg font-bold mb-3" style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif; text-transform: uppercase;">LINKEDIN</h3>
            <p class="text-white">linkedin.com/in/tu-perfil</p>
          </div>
          
          <div class="glass-card" style="background: linear-gradient(135deg, rgba(196, 255, 13, 0.1) 0%, rgba(26, 26, 26, 0.9) 100%);" data-animate="fade-up">
            <div class="corner-accent top-left"></div>
            <h3 class="text-lg font-bold mb-3" style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif; text-transform: uppercase;">GITHUB</h3>
            <p class="text-white">github.com/tu-usuario</p>
          </div>
          
          <div class="glass-card" style="background: linear-gradient(135deg, rgba(196, 255, 13, 0.1) 0%, rgba(26, 26, 26, 0.9) 100%);" data-animate="fade-up">
            <div class="corner-accent top-left"></div>
            <h3 class="text-lg font-bold mb-3" style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif; text-transform: uppercase;">UBICACIÓN</h3>
            <p class="text-white">Ciudad, País</p>
          </div>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="glass-card" data-animate="fade-up">
        <h3 class="text-3xl font-bold mb-6" style="color: #c4ff0d; font-family: 'Rajdhani', sans-serif; text-transform: uppercase;">
          Enviar Mensaje
        </h3>
        <form class="space-y-6">
          <div>
            <label class="block text-white text-sm font-bold mb-2" style="font-family: 'Rajdhani', sans-serif; text-transform: uppercase; letter-spacing: 0.05em;">Nombre</label>
            <input type="text" class="w-full px-4 py-3 text-white focus:outline-none transition-all" style="background: rgba(26, 26, 26, 0.8); border: 1px solid rgba(196, 255, 13, 0.2); clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);" placeholder="Tu nombre">
          </div>
          <div>
            <label class="block text-white text-sm font-bold mb-2" style="font-family: 'Rajdhani', sans-serif; text-transform: uppercase; letter-spacing: 0.05em;">Email</label>
            <input type="email" class="w-full px-4 py-3 text-white focus:outline-none transition-all" style="background: rgba(26, 26, 26, 0.8); border: 1px solid rgba(196, 255, 13, 0.2); clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);" placeholder="tu@email.com">
          </div>
          <div>
            <label class="block text-white text-sm font-bold mb-2" style="font-family: 'Rajdhani', sans-serif; text-transform: uppercase; letter-spacing: 0.05em;">Mensaje</label>
            <textarea rows="4" class="w-full px-4 py-3 text-white focus:outline-none transition-all resize-none" style="background: rgba(26, 26, 26, 0.8); border: 1px solid rgba(196, 255, 13, 0.2); clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);" placeholder="Tu mensaje..."></textarea>
          </div>
          <button type="submit" class="btn-primary">
            ENVIAR MENSAJE
          </button>
        </form>
      </div>
    </section>
  `,
}

// 2. Función para renderizar con transición
function renderRoute() {
  const path = window.location.hash.replace('#', '') || '/'
  const viewFn = routes[path] || routes['/']
  const outlet = document.querySelector('#view')

  if (outlet) {
    // Fade out
    outlet.style.opacity = '0'
    outlet.style.transform = 'translateY(20px)'
    
    setTimeout(() => {
      outlet.innerHTML = viewFn()
      
      // Fade in
      requestAnimationFrame(() => {
        outlet.style.opacity = '1'
        outlet.style.transform = 'translateY(0)'
      })
      
      // Actualizar navegación activa
      updateActiveNav(path)
      
      // Re-inicializar animaciones GSAP después de cambiar el contenido
      setTimeout(() => {
        initScrollAnimations()
      }, 100)
    }, 150)
  }
}

// 3. Actualizar estado activo en navegación
function updateActiveNav(currentPath) {
  document.querySelectorAll('[data-link]').forEach((btn) => {
    const linkPath = btn.getAttribute('data-link')
    if (linkPath === currentPath) {
      btn.classList.add('active')
    } else {
      btn.classList.remove('active')
    }
  })
}

// 4. Navegar a una ruta
function navigate(path) {
  if (window.location.hash !== `#${path}`) {
    window.location.hash = path
  } else {
    renderRoute()
  }
}

// 5. Montar el layout base (navbar + contenedor de vistas)
function setupApp() {
  const app = document.querySelector('#app')

  // Añadir clase para el efecto de escaneo
  document.body.classList.add('scan-effect')

  app.innerHTML = `
    <div class="min-h-screen flex flex-col">
      <header class="sticky top-0 z-50">
        <nav class="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div class="text-3xl font-bold logo-gradient cursor-pointer" onclick="window.location.hash='/'">
            YOUR NAME
          </div>
          <div class="flex gap-3 text-sm">
            <button data-link="/" class="nav-link focus-visible">
              Home
            </button>
            <button data-link="/about" class="nav-link focus-visible">
              About
            </button>
            <button data-link="/contact" class="nav-link focus-visible">
              Contact
            </button>
          </div>
        </nav>
      </header>

      <main id="view" class="max-w-6xl mx-auto px-6 py-12 flex-1 w-full" style="transition: opacity 0.3s ease, transform 0.3s ease;">
        <!-- Aquí el router inyecta las pantallas -->
      </main>

      <footer class="border-t bg-black/40 backdrop-blur-lg mt-auto" style="border-color: rgba(196, 255, 13, 0.1);">
        <div class="max-w-6xl mx-auto px-6 py-6 text-center text-gray-400 text-sm">
          <p style="font-family: 'Rajdhani', sans-serif; text-transform: uppercase; letter-spacing: 0.1em;">
            Desarrollado con <span style="color: #c4ff0d; font-weight: bold;">Vite</span> + <span style="color: #c4ff0d; font-weight: bold;">Vanilla JS</span>
          </p>
        </div>
      </footer>
    </div>
  `

  // Listeners de navegación
  document.querySelectorAll('[data-link]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const path = e.currentTarget.getAttribute('data-link')
      navigate(path)
    })
  })

  // Cuando cambia el hash de la URL
  window.addEventListener('hashchange', renderRoute)

  // Primera carga
  renderRoute()
  
  // Inicializar animaciones GSAP después de la primera carga
  setTimeout(() => {
    initScrollAnimations()
    initSmoothScroll()
  }, 200)
}

setupApp()

// 🎮 EFECTOS 3D INTERACTIVOS

// Crear partículas 3D flotantes
function createParticles3D() {
  const particleCount = 15
  const body = document.body
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle-3d'
    particle.style.left = `${Math.random() * 100}%`
    particle.style.top = `${Math.random() * 100}%`
    particle.style.animationDelay = `${Math.random() * 8}s`
    particle.style.animationDuration = `${8 + Math.random() * 4}s`
    body.appendChild(particle)
  }
}

// Crear anillos 3D decorativos
function create3DRings() {
  const hero = document.querySelector('.glass-card')
  if (!hero) return
  
  const ringsContainer = document.createElement('div')
  ringsContainer.style.position = 'absolute'
  ringsContainer.style.top = '50%'
  ringsContainer.style.left = '50%'
  ringsContainer.style.transform = 'translate(-50%, -50%)'
  ringsContainer.style.pointerEvents = 'none'
  ringsContainer.style.zIndex = '0'
  
  for (let i = 1; i <= 3; i++) {
    const ring = document.createElement('div')
    ring.className = `ring-3d ring-3d-${i}`
    ring.style.position = 'absolute'
    ring.style.top = '50%'
    ring.style.left = '50%'
    ring.style.transform = 'translate(-50%, -50%)'
    ringsContainer.appendChild(ring)
  }
  
  hero.appendChild(ringsContainer)
}

// Crear cubos 3D decorativos
function create3DCubes() {
  const sections = document.querySelectorAll('.glass-card')
  
  sections.forEach((section, index) => {
    if (index % 2 === 0) {
      const cube = document.createElement('div')
      cube.className = 'cube-3d'
      cube.style.top = `${Math.random() * 80}%`
      cube.style.left = `${Math.random() * 80}%`
      section.style.position = 'relative'
      section.appendChild(cube)
    }
  })
}

// Efecto de tilt 3D con el mouse
function init3DTilt() {
  const cards = document.querySelectorAll('.glass-card')
  
  cards.forEach(card => {
    card.classList.add('tilt-3d')
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`
    })
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)'
    })
  })
}

// Efecto de paralaje 3D en el scroll
function init3DParallax() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset
    const parallaxElements = document.querySelectorAll('.glass-card')
    
    parallaxElements.forEach((element, index) => {
      const speed = (index + 1) * 0.1
      const yPos = -(scrolled * speed)
      element.style.transform = `translateY(${yPos}px) translateZ(${index * 10}px)`
    })
  })
}

// Aplicar clases 3D a stats cards
function enhance3DStats() {
  const statsCards = document.querySelectorAll('.grid.md\\:grid-cols-4 .glass-card')
  statsCards.forEach(card => {
    card.classList.add('stats-3d', 'shadow-3d')
  })
}

// Agregar efecto holográfico a elementos específicos
function addHologramEffect() {
  const titles = document.querySelectorAll('h1, h2')
  titles.forEach((title, index) => {
    if (index === 0) {
      title.classList.add('text-3d-depth', 'hologram-3d')
    }
  })
}

// Inicializar todos los efectos 3D
function initAll3DEffects() {
  setTimeout(() => {
    createParticles3D()
    create3DRings()
    create3DCubes()
    init3DTilt()
    enhance3DStats()
    addHologramEffect()
    
    // Agregar clases floating-3d a elementos aleatorios
    const cards = document.querySelectorAll('.glass-card')
    cards.forEach((card, index) => {
      if (index % 3 === 0) {
        card.classList.add('floating-3d')
      }
    })
  }, 500)
}

// Ejecutar efectos 3D cuando la página carga
window.addEventListener('load', initAll3DEffects)

// Re-ejecutar efectos 3D cuando cambia la ruta
window.addEventListener('hashchange', () => {
  setTimeout(initAll3DEffects, 300)
})
