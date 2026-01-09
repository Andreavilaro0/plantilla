import HomeView from '@/features/home/HomeView.js'
import AboutView from '@/features/about/AboutView.js'
import ContactView from '@/features/contact/ContactView.js'
import ServicesView from '@/features/services/ServicesView.js'
import PortfolioView from '@/features/portfolio/PortfolioView.js'
import { lifecycle } from '@/core/lifecycle.js'
import { ROUTES } from '@/core/constants.js'

const routes = {
  '/': HomeView,
  '/about': AboutView,
  '/contact': ContactView,
  '/services': ServicesView,
  '/portfolio': PortfolioView
}

class Router {
  constructor() {
    this.currentRoute = null
    this.init()
  }

  init() {
    window.addEventListener('popstate', () => this.loadRoute())
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault()
        this.navigateTo(e.target.getAttribute('href'))
      }
    })
    this.loadRoute()
  }

  navigateTo(path) {
    window.history.pushState(null, null, path)
    this.loadRoute()
  }

  async loadRoute() {
    const path = window.location.pathname.replace('/plantilla', '') || '/'
    const route = routes[path] || routes['/']

    this.currentRoute = path
    this.render(route)
    this.updateActiveLinks()
    
    // Initialize view with lifecycle manager
    setTimeout(async () => {
      if (path === ROUTES.HOME) {
        await lifecycle.initHome();
      }
      else if (path === ROUTES.ABOUT) {
        await lifecycle.initAbout();
      }
      else if (path === ROUTES.PORTFOLIO) {
        await lifecycle.initPortfolio();
      }
      else if (path === ROUTES.CONTACT) {
        await lifecycle.initContact();
      }
      else if (path === ROUTES.SERVICES) {
        await lifecycle.initServices();
      }
      
      // Update ScrollTrigger for any new content
      if (window.gsap && window.gsap.ScrollTrigger) {
        window.gsap.ScrollTrigger.refresh();
      }
    }, 150)
  }

  render(view) {
    const app = document.querySelector('#app')
    if (app) {
      app.innerHTML = view()
    }
  }

  updateActiveLinks() {
    document.querySelectorAll('[data-link]').forEach(link => {
      const href = link.getAttribute('href').replace('/plantilla', '')
      if (href === this.currentRoute) {
        link.classList.add('active')
        link.setAttribute('aria-current', 'page')
      } else {
        link.classList.remove('active')
        link.removeAttribute('aria-current')
      }
    })
    
    // Update navbar links if setActiveLink is available
    if (window.setNavbarActiveLink) {
      window.setNavbarActiveLink()
    }
  }
}

export default new Router()
