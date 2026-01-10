import rawData from "@/data/obras.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { log } from '@/utils/logger.js';

gsap.registerPlugin(ScrollTrigger, Flip);

const asset = (p) => {
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  return new URL(p, import.meta.env.BASE_URL).pathname;
};

export class PortfolioController {
  constructor(root = document.getElementById("portfolio")) {
    this.root = root;
    this.grid = root?.querySelector("#portfolio-grid");
    this.stage = root?.querySelector(".portfolio-stage");
    this.bgWord = root?.querySelector(".portfolio-bgword");
    this.items = [];
    this.isFocusMode = false;
    this.timeline = null;
  }

  mount() {
    if (!this.root || !this.grid) {
      console.warn("[Portfolio] Root or grid not found");
      return;
    }

    // Prepare Data
    const data = Array.isArray(rawData) ? rawData : [];
    this.data = data.slice(0, 15).map(this._enrichData); // Limit to 15

    // Render Clean Items
    this._render();
    
    // Setup Interactions
    this._setupStageInteractions();
    
    // Setup Resize Listener for Masonry
    this._resizeHandler = this._debounce(() => {
        if (!this.isFocusMode) this._calculateMasonrySpans();
    }, 200);
    window.addEventListener('resize', this._resizeHandler);

    // Initial Masonry Calc (wait for images)
    this._waitForImages().then(() => {
        this._calculateMasonrySpans();
        ScrollTrigger.refresh();
    });

    // Create Close Button for Focus Mode
    this._createCloseButton();
  }

  destroy() {
    if (this.timeline) this.timeline.kill();
    ScrollTrigger.getAll().forEach(st => {
       if (st.trigger === this.stage || st.trigger === this.bgWord) st.kill();
    });
    window.removeEventListener('resize', this._resizeHandler);
    this.closeBtn?.remove();
  }

  // ========================================================
  // DATA & RENDER
  // ========================================================
  _enrichData(d, i) {
    return {
      ...d,
      id: `work-${i}`,
      src: asset(d.src),
      title: d.title || "Untitled",
      year: d.year || "2024",
      media: d.media || "Photography",
      orientation: d.width && d.height ? (d.width > d.height ? 'landscape' : 'portrait') : 'landscape'
    };
  }

  _render() {
    this.grid.innerHTML = "";
    const frag = document.createDocumentFragment();

    this.data.forEach((item, index) => {
      const el = document.createElement("article");
      el.className = "obra-item";
      el.dataset.index = index;
      el.dataset.id = item.id;
      
      el.innerHTML = `
        <div class="obra-media">
           <div class="obra-contenedor">
             <img src="${item.src}" alt="${item.title}" class="obra-img" loading="lazy">
           </div>
           <div class="obra-caption">
             <span class="obra-title">${item.title}</span>
             <span class="obra-meta">${item.year}</span>
           </div>
        </div>
      `;
      
      // Click Interaction -> Focus Mode
      el.addEventListener('click', (e) => this._toFocusMode(index));
      
      frag.appendChild(el);
    });

    this.grid.appendChild(frag);
    this.items = Array.from(this.grid.children);
    
    log(`[Portfolio] ✅ Rendered ${this.items.length} items to grid`);
  }

  _waitForImages() {
    const imgs = Array.from(this.grid.querySelectorAll('img'));
    return Promise.all(imgs.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => img.addEventListener('load', resolve, { once: true }));
    }));
  }

  _calculateMasonrySpans() {
    // Only run if NOT in focus mode and NOT mobile (stack on mobile)
    if (window.innerWidth < 768) return; 

    const rowHeight = 2; // matches CSS grid-auto-rows: 2px
    const gap = 32; // Approx matches CSS gap (clamp) - simplified for calc
    
    this.items.forEach(item => {
        const img = item.querySelector('img');
        const cont = item.querySelector('.obra-contenedor');
        if (!img || !cont) return;
        
        // Reset to auto first
        item.style.gridRowEnd = 'auto';
        
        // Natural height based on column width
        const width = item.getBoundingClientRect().width;
        // Aspect ratio from image natural dims
        const ratio = (img.naturalHeight || 100) / (img.naturalWidth || 100);
        const height = width * ratio;
        
        const rowSpan = Math.ceil((height + gap) / (rowHeight)); // Simplified logic
        // Use a more robust formula if gap is included in row calculation, 
        // but with grid-row-gap, we actually just need to cover the content height.
        // Actually, for dense grid: span = ceil(contentHeight / rowHeightOffset) + gap_adjustment?
        // Simple version:
        const span = Math.ceil((height) / rowHeight) + Math.ceil(gap / rowHeight); 
        item.style.gridRowEnd = `span ${span}`;
    });
  }

  // ========================================================
  // STAGE SCROLL REVEAL (The "Nothing... BOOM" moment)
  // ========================================================
  _setupStageInteractions() {
    if (!this.bgWord || !this.grid || !this.stage) {
      console.warn("[Portfolio] Missing stage elements, animations disabled");
      return;
    }
    
    log("[Portfolio] Setting up stage interactions...");
    
    // Set initial hidden states for animation
    gsap.set(this.bgWord, { opacity: 0, scale: 0.95 });
    gsap.set(this.grid, { opacity: 0, y: 40 });
    
    // Create Timeline attached to ScrollTrigger
    this.timeline = gsap.timeline({
        scrollTrigger: {
            trigger: this.stage,
            start: "top 80%", // When stage enters viewport
            end: "top 20%",   // Complete by center
            scrub: 0.5,
            onEnter: () => log("[Portfolio] ✅ Stage entered"),
            onComplete: () => log("[Portfolio] ✅ Stage animation complete"),
            onEnterBack: () => log("[Portfolio] Stage re-entered (scroll back)"),
        }
    });

    // Pin the background word
    ScrollTrigger.create({
        trigger: this.stage,
        start: "top top",
        end: "bottom bottom",
        pin: this.bgWord,
        pinSpacing: false
    });

    // Animation Sequence
    this.timeline
        .to(this.bgWord, {
            opacity: 0.08,
            scale: 1,
            duration: 1,
            ease: "power2.out"
        })
        .to(this.grid, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
        }, "-=0.7");
        
    log("[Portfolio] ✅ Stage Interactions Set");
  }

  // ========================================================
  // FOCUS MODE (FLIP) - Hannah Miles Style
  // ========================================================
  _toFocusMode(index) {
    if (this.isFocusMode) {
      // If already in focus mode, switch active item
      this._switchActiveItem(index);
      return;
    }

    this.isFocusMode = true;
    this.activeIndex = index;
    const activeItem = this.items[index];

    // 1. Capture State
    const state = Flip.getState(this.items);

    // 2. Change Layout Classes
    this.grid.classList.add('is-focus-mode');

    // Reorder DOM: Active first, then thumbnails
    this.grid.appendChild(activeItem); // Move to end (visually first with grid)

    this.items.forEach((item, i) => {
        item.style.gridRowEnd = ""; // Clear masonry spans

        if (i === index) {
            item.classList.add('is-active');
            item.classList.remove('is-dim');
        } else {
            item.classList.add('is-dim');
            item.classList.remove('is-active');

            // Make thumbnails clickable to switch
            item.style.cursor = 'pointer';
        }
    });

    // 3. Animate (FLIP)
    Flip.from(state, {
        duration: 0.7,
        ease: "power3.inOut",
        scale: true,
        onComplete: () => {
             this.closeBtn.classList.add('visible');

             // Scroll to top of portfolio stage for better view
             const stageTop = this.stage?.getBoundingClientRect().top + window.scrollY;
             gsap.to(window, {
               scrollTo: { y: stageTop - 80 },
               duration: 0.5,
               ease: "power2.inOut"
             });
        }
    });
  }

  _switchActiveItem(newIndex) {
    if (newIndex === this.activeIndex) return;

    const state = Flip.getState(this.items);

    this.activeIndex = newIndex;
    const newActiveItem = this.items[newIndex];

    // Reorder DOM
    this.grid.appendChild(newActiveItem);

    // Update classes
    this.items.forEach((item, i) => {
        if (i === newIndex) {
            item.classList.add('is-active');
            item.classList.remove('is-dim');
        } else {
            item.classList.add('is-dim');
            item.classList.remove('is-active');
        }
    });

    // Animate switch
    Flip.from(state, {
        duration: 0.5,
        ease: "power2.inOut",
        scale: true
    });
  }

  _exitFocusMode() {
    if (!this.isFocusMode) return;
    this.isFocusMode = false;
    this.activeIndex = null;
    this.closeBtn.classList.remove('visible');

    // 1. Capture State
    const state = Flip.getState(this.items);

    // 2. Reset Layout Classes
    this.grid.classList.remove('is-focus-mode');
    this.items.forEach(item => {
        item.classList.remove('is-active', 'is-dim');
        item.style.gridColumn = "";
        item.style.gridRowEnd = "";
        item.style.cursor = "pointer";
    });

    // 3. Restore original DOM order
    this.items.forEach(item => this.grid.appendChild(item));

    // Recalculate Masonry Spans to restore original layout
    this._calculateMasonrySpans();

    // 4. Animate (FLIP)
    Flip.from(state, {
        duration: 0.6,
        ease: "power3.inOut",
        scale: true
    });
  }

  _createCloseButton() {
     const btn = document.createElement('div');
     btn.className = 'portfolio-close-btn';
     btn.innerHTML = '×';
     btn.addEventListener('click', () => this._exitFocusMode());
     document.body.appendChild(btn);
     this.closeBtn = btn;
     
     // Also close on ESC
     document.addEventListener('keydown', (e) => {
         if (e.key === 'Escape') this._exitFocusMode();
     });
  }

  _debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
}

