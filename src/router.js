import HomeView from './views/HomeView.js'
import AboutView from './views/AboutView.js'
import ContactView from './views/ContactView.js'

const routes = {
  '/': HomeView,
  '/about': AboutView,
  '/contact': ContactView
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
    
    this.currentRoute = path
    this.render(route)
    this.updateActiveLinks()
  }

  render(view) {
    const app = document.querySelector('#app')
    if (app) {
      app.innerHTML = view()
      
      if (window.scroll) {
        window.scroll.update()
      }
    }
  }

  updateActiveLinks() {
    document.querySelectorAll('[data-link]').forEach(link => {
      const href = link.getAttribute('href').replace('/plantilla', '')
      if (href === this.currentRoute) {
        link.classList.add('active')
      } else {
        link.classList.remove('active')
      }
    })
  }
}

export default new Router()
