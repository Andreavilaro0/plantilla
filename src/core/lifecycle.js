// core/lifecycle.js
// Centralized lifecycle management for views and components
// Replaces window.* global functions with a clean, testable API

import { SELECTORS, TIMING } from '@/core/constants.js';
import { AboutController } from '@/features/about/AboutController.js';
import { log } from '@/utils/logger.js';

/**
 * LifecycleManager
 * Manages mounting/unmounting of views and their associated controllers
 */
class LifecycleManager {
  constructor() {
    this.currentView = null;
    this.instances = new Map();
    this.cleanupFunctions = new Map();
  }

  /**
   * Mount a view with its associated controllers/animations
   * @param {string} viewName - Name of the view (e.g., 'home', 'about')
   * @param {Object} options - Mount options { init: Function, cleanup: Function }
   */
  async mountView(viewName, options = {}) {
    log(`🔄 [Lifecycle] Mounting view: ${viewName}`);
    
    // Cleanup previous view
    await this.unmountCurrent();
    
    // Set current view
    this.currentView = viewName;
    
    // Execute init function if provided
    if (options.init && typeof options.init === 'function') {
      try {
        await options.init();
        
        // Store cleanup function if provided
        if (options.cleanup && typeof options.cleanup === 'function') {
          this.cleanupFunctions.set(viewName, options.cleanup);
        }
        
        log(`✅ [Lifecycle] View mounted: ${viewName}`);
      } catch (error) {
        console.error(`❌ [Lifecycle] Error mounting ${viewName}:`, error);
      }
    }
  }

  /**
   * Unmount current view and cleanup its resources
   */
  async unmountCurrent() {
    if (!this.currentView) return;
    
    log(`🧹 [Lifecycle] Unmounting view: ${this.currentView}`);
    
    // Execute cleanup function if exists
    const cleanup = this.cleanupFunctions.get(this.currentView);
    if (cleanup) {
      try {
        await cleanup();
        this.cleanupFunctions.delete(this.currentView);
      } catch (error) {
        console.error(`❌ [Lifecycle] Error during cleanup:`, error);
      }
    }
    
    // Clear instances
    this.instances.delete(this.currentView);
    this.currentView = null;
  }

  /**
   * Store an instance for later cleanup
   */
  storeInstance(key, instance) {
    this.instances.set(key, instance);
  }

  /**
   * Get a stored instance
   */
  getInstance(key) {
    return this.instances.get(key);
  }

  /**
   * Initialize Home view
   */
  async initHome() {
    const { gsap } = window;
    
    return this.mountView('home', {
      init: async () => {
        // Fade-in app container
        const app = document.querySelector(SELECTORS.APP);
        if (app) {
          gsap.fromTo(app,
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease: 'power2.out' }
          );
        }
        
        // Refresh ScrollTrigger after animations
        setTimeout(() => {
          if (gsap.ScrollTrigger) {
            gsap.ScrollTrigger.refresh();
          }
        }, TIMING.SCROLL_REFRESH_DELAY);
      },
      cleanup: async () => {
        // Cleanup home-specific resources if needed
        if (window.cleanupPortfolioEntrance) {
          window.cleanupPortfolioEntrance();
        }
      }
    });
  }

  /**
   * Initialize About view
   */
  async initAbout() {
    return this.mountView('about', {
      init: async () => {
        // New About section is purely HTML/CSS/SVG-based, no controller needed
        log('🎨 About section initialized (blob effect)');
      },
      cleanup: async () => {
        // No cleanup needed for static About section
      }
    });
  }

  /**
   * Initialize Portfolio view
   */
  async initPortfolio() {
    return this.mountView('portfolio', {
      init: async () => {
        log('📸 Portfolio view loaded');
        // PortfolioController is already initialized by PortfolioView
      },
      cleanup: async () => {
        // Cleanup portfolio-specific resources
        if (window.__portfolioController && window.__portfolioController.destroy) {
          window.__portfolioController.destroy();
        }
      }
    });
  }

  /**
   * Initialize Contact view
   */
  async initContact() {
    return this.mountView('contact', {
      init: async () => {
        log('📧 Contact view loaded');
      }
    });
  }

  /**
   * Initialize Services view
   */
  async initServices() {
    return this.mountView('services', {
      init: async () => {
        log('🛠️ Services view loaded');
      }
    });
  }
}

// Export singleton instance
export const lifecycle = new LifecycleManager();
