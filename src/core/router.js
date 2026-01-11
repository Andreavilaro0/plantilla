import HomeView from '@/features/home/HomeView.js'
import { lifecycle } from '@/core/lifecycle.js'

const routes = {
  '#home': { section: '#hero', init: () => lifecycle.initHome() },
  '#about': { section: '#about', init: () => lifecycle.initAbout() },
  '#portfolio': { section: '#portfolio', init: () => lifecycle.initPortfolio() },
  '#testimonials': { section: '#testimonials', init: () => lifecycle.initTestimonials() },
  '#services': { section: '#services', init: () => lifecycle.initServices() },
  '#contact': { section: '#contact', init: () => lifecycle.initContact() }
}

class Router {
  constructor() {
    this.currentRoute = null
    this.init()
  }

  init() {
    window.addEventListener('hashchange', () => this.loadRoute())
    this.loadRoute()
  }

  getRoute() {
    const hash = window.location.hash || '#home'
    if (hash === '#hero') {
      return '#home'
    }
    return routes[hash] ? hash : '#home'
  }

  async loadRoute() {
    const routeKey = this.getRoute()
    const route = routes[routeKey]

    if (!this.currentRoute) {
      this.render(HomeView)
    }

    this.currentRoute = routeKey
    this.updateActiveLinks()

    if (route?.section) {
      this.scrollToSection(route.section)
    }

    setTimeout(async () => {
      if (route?.init) {
        await route.init()
      }

      if (window.gsap && window.gsap.ScrollTrigger) {
        window.gsap.ScrollTrigger.refresh()
      }
    }, 200)
  }

  scrollToSection(sectionSelector) {
    const target = document.querySelector(sectionSelector)
    if (!target) return

    window.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
  }

  render(view) {
    const app = document.querySelector('#app')
    if (app) {
      app.innerHTML = view()
    }
  }

  updateActiveLinks() {
    const currentHash = this.currentRoute
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      const href = link.getAttribute('href')
      if (href === currentHash) {
        link.classList.add('active')
        link.setAttribute('aria-current', 'page')
      } else {
        link.classList.remove('active')
        link.removeAttribute('aria-current')
      }
    })

    if (window.setNavbarActiveLink) {
      window.setNavbarActiveLink(this.currentRoute)
    }
  }
}

export default new Router()
