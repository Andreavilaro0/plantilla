import HomeView from './views/HomeView.js'
import AboutView from './views/AboutView.js'
import ContactView from './views/ContactView.js'
import ServicesView from './views/ServicesView.js'
import PortfolioView from './views/PortfolioView.js'

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

  loadRoute() {
    const path = window.location.pathname.replace('/plantilla', '') || '/'
    const route = routes[path] || routes['/']

    // Cleanup previous route
    if (window.destroyAbout) {
      window.destroyAbout();
    }

    this.currentRoute = path
    this.render(route)
    this.updateActiveLinks()
    
    // Final initialization after render
    setTimeout(() => {
      if (path === '/') {
        if (window.initAnimations) window.initAnimations();
      }
      
      if (path === '/about') {
        if (window.initAboutWindow) window.initAboutWindow();
      }
      
      if (path === '/portfolio') {
        // PortfolioController is already initialized by PortfolioView
        console.log('📸 Portfolio view loaded');
      }
      
      // Update ScrollTrigger for any new content
      if (window.gsap && window.gsap.registerPlugin) {
        const { ScrollTrigger } = window.gsap;
        if (ScrollTrigger) ScrollTrigger.refresh();
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
