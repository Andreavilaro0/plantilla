import rawData from "../data/obras.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const asset = (p) => {
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  return new URL(p, import.meta.env.BASE_URL).pathname;
};

function getOrientation(w, h) {
  if (!w || !h) return "landscape";
  const r = w / h;
  if (Math.abs(r - 1) < 0.05) return "square";
  return r > 1 ? "landscape" : "portrait";
}

function ratioClass({ ratio, width, height }) {
  if (ratio) return ratio === "3:4" ? "aspect-3-4" : ratio === "1:1" ? "aspect-1-1" : "aspect-4-3";
  if (width && height) {
    const r = width / height;
    if (Math.abs(r - 1) < 0.05) return "aspect-1-1";
    return r > 1 ? "aspect-4-3" : "aspect-3-4";
  }
  return "aspect-4-3";
}

export class PortfolioController {
  constructor(root = document.getElementById("portfolio")) {
    this.root = root;
    this.grid = root?.querySelector("#portfolio-grid");
    this.empty = root?.querySelector("#portfolio-empty");
    this.maxZIndex = 100;
    this.useMasonry = false; // Cambiar a true para masonry automático
  }

  mount() {
    if (!this.root || !this.grid) {
      console.error("[Portfolio] Falta #portfolio o #portfolio-grid");
      return;
    }

    // Purga
    ["portfolio-search", "portfolio-filter", "portfolio-sort"].forEach(id => {
      document.getElementById(id)?.remove();
    });

    this.root.querySelectorAll('button, [role="button"]').forEach(btn => {
      if (btn.textContent.match(/guardar|save/i)) btn.remove();
    });

    const p = this.grid.parentElement;
    if (p?.classList.contains("frame")) p.replaceWith(this.grid);

    // Normalizar datos
    const data = Array.isArray(rawData) ? rawData : [];
    this.data = this._enrichData(data);

    this._render();
    this._setupAnimations();
    this._setupCursor();
    this._setupZIndexInteraction();

    // Masonry automático (opcional)
    if (this.useMasonry) {
      this._setupMasonry();
    }
  }

  destroy() {
    this._teardownAnimations?.();
    this._teardownCursor?.();
    this._teardownZIndex?.();
    this._teardownMasonry?.();
  }

  // ENRIQUECER DATOS CON LÓGICA DE MOSAICO
  _enrichData(data) {
    return data.map((d, i) => {
      const orientation = getOrientation(d.width, d.height);

      // Si no tiene size asignado, aplicar heurística de ritmo
      let size = d.size;
      if (!size) {
        // Patrón: cada 5ª obra ancha, cada 7ª alta, etc.
        if (i % 5 === 0 && d.ratio === "4:3") size = "w2";
        if (i % 7 === 0 && d.ratio === "3:4") size = "h2";
        // Muy ocasional: hero
        if (i % 12 === 0) size = "w2h2";
      }

      return {
        ...d,
        src: asset(d.src),
        title: d.title || "Obra",
        alt: d.alt || `${d.title || "Obra"}${d.year ? ", " + d.year : ""}`,
        rcls: ratioClass(d),
        ocls: `obra--${orientation}`,
        size: size,
        featured: d.featured || false,
        objectPosition: d.objectPosition || "50% 50%",
        zIndex: d.zIndex || 1
      };
    });
  }

  _render() {
    if (!this.data?.length) {
      this.grid.innerHTML = "";
      this.empty?.classList.remove("hidden");
      return;
    }
    this.empty?.classList.add("hidden");

    const frag = document.createDocumentFragment();

    this.data.forEach((item, index) => {
      const article = document.createElement("article");
      article.className = `obra-item ${item.ocls}`;

      // Añadir clases de span según size
      if (item.size === "w2") article.classList.add("span-w2");
      if (item.size === "h2") article.classList.add("span-h2");
      if (item.size === "w2h2") article.classList.add("span-w2h2");

      article.tabIndex = 0;
      article.setAttribute("role", "img");
      article.setAttribute("aria-label", item.alt);
      article.dataset.index = index;
      article.style.zIndex = item.zIndex;

      const frame = document.createElement("div");
      frame.className = "frame";
      if (item.featured) frame.classList.add("featured");

      const bar = document.createElement("div");
      bar.className = "frame-bar";

      const dotsContainer = document.createElement("div");
      dotsContainer.className = "frame-dots";
      dotsContainer.innerHTML = `
        <span class="dot dot-red"></span>
        <span class="dot dot-yellow"></span>
        <span class="dot dot-green"></span>
      `;

      const titleSpan = document.createElement("span");
      titleSpan.className = "frame-title";
      titleSpan.textContent = item.title;

      const yearSpan = document.createElement("span");
      yearSpan.className = "frame-year";
      yearSpan.textContent = item.year;

      bar.appendChild(dotsContainer);
      bar.appendChild(titleSpan);
      bar.appendChild(yearSpan);

      const imgContainer = document.createElement("div");
      imgContainer.className = `obra-contenedor ${item.rcls}`;

      const skeleton = document.createElement("div");
      skeleton.className = "obra-skeleton";

      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt;
      img.loading = index < 6 ? "eager" : "lazy";
      img.decoding = "async";
      if (item.width) img.width = item.width;
      if (item.height) img.height = item.height;
      img.className = "obra-img";
      // CLAVE: object-position personalizado
      img.style.objectPosition = item.objectPosition;

      img.addEventListener("load", () => {
        skeleton.remove();
        // Si masonry, recalcular al cargar imagen
        if (this.useMasonry) {
          this._applyMasonry();
        }
      }, { once: true });

      img.addEventListener("error", () => {
        skeleton.remove();
        img.style.opacity = "0.4";
      }, { once: true });

      imgContainer.appendChild(skeleton);
      imgContainer.appendChild(img);
      frame.appendChild(bar);
      frame.appendChild(imgContainer);
      article.appendChild(frame);
      frag.appendChild(article);
    });

    this.grid.replaceChildren(frag);
    console.log(`[Portfolio] ✅ ${this.grid.children.length} obras renderizadas`);
  }

  // MASONRY AUTOMÁTICO (OPCIONAL)
  _setupMasonry() {
    this.grid.classList.add("masonry");

    // Aplicar al montar
    this._applyMasonry();

    // Reajustar en resize
    this.resizeObserver = new ResizeObserver(() => {
      this._applyMasonry();
    });
    this.resizeObserver.observe(this.grid);

    this._teardownMasonry = () => {
      this.resizeObserver?.disconnect();
    };
  }

  _applyMasonry() {
    const rowSize = 8; // Debe coincidir con --masonry-row-size
    const gap = 22;    // Debe coincidir con --grid-gap-desktop

    const items = this.grid.querySelectorAll(".obra-item");
    items.forEach(item => {
      const container = item.querySelector(".obra-contenedor");
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const span = Math.ceil((rect.height + gap) / (rowSize + gap));
      item.style.gridRowEnd = `span ${span}`;
    });
  }

  _setupAnimations() {
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) {
      this.grid.querySelectorAll(".obra-item").forEach(el => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      console.log("[Portfolio] Animaciones deshabilitadas");
      return;
    }

    const root = this.root;
    const items = Array.from(this.grid.querySelectorAll(".obra-item"));

    const ctx = gsap.context(() => {

      items.forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true
          }
        });

        const img = el.querySelector(".obra-img");
        if (img) {
          gsap.fromTo(img,
            { y: -8 },
            {
              y: 8,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2
              }
            }
          );
        }
      });

      ScrollTrigger.refresh();
      console.log("[Portfolio] ✅ Animaciones activadas");

    }, root);

    this._ctx = ctx;
    this._teardownAnimations = () => {
      try {
        ctx.revert();
        ScrollTrigger.getAll().forEach(st => {
          if (st.vars.trigger?.closest("#portfolio")) st.kill();
        });
      } catch (err) {
        console.warn("[Portfolio] Error cleanup:", err);
      }
    };
  }

  _setupCursor() {
    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    document.body.appendChild(cursor);

    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    cursor.appendChild(dot);

    let cursorX = 0, cursorY = 0;
    let currentX = 0, currentY = 0;

    const updateCursor = () => {
      const diffX = cursorX - currentX;
      const diffY = cursorY - currentY;

      currentX += diffX * 0.12;
      currentY += diffY * 0.12;

      cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;

      requestAnimationFrame(updateCursor);
    };
    updateCursor();

    const onMouseMove = (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });

    const items = this.grid.querySelectorAll(".obra-item");
    items.forEach(item => {
      item.addEventListener("mouseenter", () => {
        cursor.classList.add("hover");
      });
      item.addEventListener("mouseleave", () => {
        cursor.classList.remove("hover");
      });
    });

    this._teardownCursor = () => {
      document.removeEventListener("mousemove", onMouseMove);
      cursor.remove();
    };
  }

  _setupZIndexInteraction() {
    const items = this.grid.querySelectorAll(".obra-item");

    items.forEach(item => {
      item.addEventListener("click", () => {
        this.maxZIndex++;
        item.style.zIndex = this.maxZIndex;

        gsap.fromTo(item,
          { scale: 1 },
          {
            scale: 1.02,
            duration: 0.12,
            ease: "back.out(1.5)",
            yoyo: true,
            repeat: 1
          }
        );
      });
    });

    this._teardownZIndex = () => {};
  }
}
