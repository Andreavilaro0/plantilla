import rawData from "../data/obras.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const asset = (p) => {
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  return new URL(p, import.meta.env.BASE_URL).pathname;
};

function getOrientation(w, h) {
  if (!w || !h) return "landscape";
  const r = w / h;
  if (Math.abs(r - 1) < 0.05) return "square";
  return r > 1 ? "landscape" : "portrait";
}

function ratioClass({ ratio, width, height }) {
  if (ratio)
    return ratio === "3:4"
      ? "aspect-3-4"
      : ratio === "1:1"
      ? "aspect-1-1"
      : "aspect-4-3";
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
    this.draggedElement = null;
    this.initialX = 0;
    this.initialY = 0;
    this.currentX = 0;
    this.currentY = 0;
  }

  mount() {
    if (!this.root || !this.grid) {
      console.error("[Portfolio] Falta #portfolio o #portfolio-grid");
      return;
    }

    // Purga
    ["portfolio-search", "portfolio-filter", "portfolio-sort"].forEach((id) => {
      document.getElementById(id)?.remove();
    });

    this.root.querySelectorAll('button, [role="button"]').forEach((btn) => {
      if (btn.textContent.match(/guardar|save/i)) btn.remove();
    });

    const p = this.grid.parentElement;
    if (p?.classList.contains("frame")) p.replaceWith(this.grid);

    // Normalizar datos
    const data = Array.isArray(rawData) ? rawData : [];
    this.data = this._enrichData(data);

    this._render();
    this._setupAnimations();
    this._setupDragAndDrop();
  }

  destroy() {
    this._teardownAnimations?.();
    this._teardownDragAndDrop?.();
  }

  _enrichData(data) {
    return data.map((d, i) => {
      const orientation = getOrientation(d.width, d.height);

      // Generar coordenadas esparcidas tipo ReadyMag
      let x, y;
      
      if (d.x !== undefined && d.y !== undefined) {
        // Usar coordenadas predefinidas si existen
        x = d.x;
        y = d.y;
      } else {
        // Algoritmo de distribución esparcida - VERSIÓN MEJORADA
        // Distribuir en patrón zigzag para evitar solapamientos
        
        // Alternar entre izquierda y derecha más agresivamente
        const isLeftSide = i % 2 === 0;
        
        // Distribución horizontal: mucho más espaciada
        if (isLeftSide) {
          // Lado izquierdo: 0-30%
          x = Math.random() * 30;
        } else {
          // Lado derecho: 50-70%
          x = 50 + Math.random() * 20;
        }
        
        // Distribución vertical: mucho más espacio entre elementos
        const baseY = i * 12; // 12vh entre cada obra (más espaciado)
        const variationY = (Math.random() - 0.5) * 8; // ±4vh de variación
        y = baseY + variationY;
      }

      return {
        ...d,
        src: asset(d.src),
        title: d.title || "Obra",
        alt: d.alt || `${d.title || "Obra"}${d.year ? ", " + d.year : ""}`,
        rcls: ratioClass(d),
        ocls: `obra--${orientation}`,
        size: d.size,
        featured: d.featured || false,
        objectPosition: d.objectPosition || "50% 50%",
        zIndex: d.zIndex || (i + 1),
        x: x,
        y: y,
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
      // NO añadir clase 'showcase-item' para evitar objetos 3D flotantes

      // Añadir clases de span según size
      if (item.size === "w2") article.classList.add("span-w2");
      if (item.size === "h2") article.classList.add("span-h2");
      if (item.size === "w2h2") article.classList.add("span-w2h2");

      // POSICIONAMIENTO ABSOLUTO
      article.style.left = `${item.x}%`;
      article.style.top = `${item.y}vh`;

      article.tabIndex = 0;
      article.setAttribute("role", "img");
      article.setAttribute("aria-label", item.alt);
      article.dataset.index = index;
      article.dataset.x = item.x;
      article.dataset.y = item.y;
      article.style.zIndex = item.zIndex;
      // NO añadir dataset.imageSrc, dataset.title, dataset.aspectRatio, dataset.layer para Showcase

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
      img.style.objectPosition = item.objectPosition;
      img.draggable = false;

      img.addEventListener(
        "load",
        () => {
          skeleton.remove();
        },
        { once: true }
      );

      img.addEventListener(
        "error",
        () => {
          skeleton.remove();
          img.style.opacity = "0.4";
        },
        { once: true }
      );

      imgContainer.appendChild(skeleton);
      imgContainer.appendChild(img);
      frame.appendChild(bar);
      frame.appendChild(imgContainer);
      article.appendChild(frame);
      frag.appendChild(article);
    });

    this.grid.replaceChildren(frag);
    console.log(
      `[Portfolio] ✅ ${this.grid.children.length} obras renderizadas`
    );
  }

  _setupAnimations() {
    const prefersReduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduce) {
      this.grid.querySelectorAll(".obra-item").forEach((el) => {
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
          delay: i * 0.03,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        });

        const img = el.querySelector(".obra-img");
        if (img) {
          gsap.fromTo(
            img,
            { y: -5 },
            {
              y: 5,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
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
        ScrollTrigger.getAll().forEach((st) => {
          if (st.vars.trigger?.closest("#portfolio")) st.kill();
        });
      } catch (err) {
        console.warn("[Portfolio] Error cleanup:", err);
      }
    };
  }



  _setupDragAndDrop() {
    const items = this.grid.querySelectorAll(".obra-item");

    items.forEach((item) => {
      item.addEventListener("mousedown", this._onDragStart.bind(this));
      item.addEventListener("touchstart", this._onDragStart.bind(this), {
        passive: false,
      });
    });

    document.addEventListener("mousemove", this._onDrag.bind(this));
    document.addEventListener("touchmove", this._onDrag.bind(this), {
      passive: false,
    });

    document.addEventListener("mouseup", this._onDragEnd.bind(this));
    document.addEventListener("touchend", this._onDragEnd.bind(this));

    this._teardownDragAndDrop = () => {
      document.removeEventListener("mousemove", this._onDrag.bind(this));
      document.removeEventListener("touchmove", this._onDrag.bind(this));
      document.removeEventListener("mouseup", this._onDragEnd.bind(this));
      document.removeEventListener("touchend", this._onDragEnd.bind(this));
    };
  }

  _onDragStart(e) {
    const target = e.currentTarget;

    // Traer al frente
    this.maxZIndex++;
    target.style.zIndex = this.maxZIndex;

    this.draggedElement = target;
    this.draggedElement.classList.add("dragging");

    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

    const rect = target.getBoundingClientRect();
    this.initialX = clientX - rect.left;
    this.initialY = clientY - rect.top;

    e.preventDefault();
  }

  _onDrag(e) {
    if (!this.draggedElement) return;

    e.preventDefault();

    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

    this.currentX = clientX - this.initialX;
    this.currentY = clientY - this.initialY;

    this.draggedElement.style.left = `${this.currentX}px`;
    this.draggedElement.style.top = `${this.currentY}px`;
  }

  _onDragEnd(e) {
    if (!this.draggedElement) return;

    this.draggedElement.classList.remove("dragging");
    this.draggedElement = null;
  }
}
