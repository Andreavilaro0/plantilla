import rawData from "../data/obras.js";

// Resolver rutas compatibles con GitHub Pages
const asset = (p) => new URL(p, import.meta.env.BASE_URL).pathname;

// Selección de ratio -> clase
const ratioClass = (ratio, w, h) => {
  if (ratio) return ratio === "3:4" ? "aspect-3-4" : ratio === "1:1" ? "aspect-1-1" : "aspect-4-3";
  if (w && h) { const r = w / h; if (Math.abs(r - 1) < 0.05) return "aspect-1-1"; return r > 1 ? "aspect-4-3" : "aspect-3-4"; }
  return "aspect-4-3";
};

export class PortfolioController {
  constructor(root = document.getElementById("portfolio")) {
    this.root = root;
    this.grid = root?.querySelector("#portfolio-grid");
    this.empty = root?.querySelector("#portfolio-empty");
    this._assertGrid = this._assertGrid.bind(this);
  }

  mount(){
    if (!this.root || !this.grid) { console.error("[Portfolio] Falta #portfolio o #portfolio-grid"); return; }

    // 🔒 PURGA ESTRICTA: eliminar cualquier filtro/búsqueda/orden o marco global heredado
    ["portfolio-search","portfolio-filter","portfolio-sort"].forEach(id => document.getElementById(id)?.remove());
    // Si hubiera un wrapper tipo "frame" envolviendo TODO el grid, quitarlo:
    const p = this.grid.parentElement; if (p?.classList.contains("frame")) p.replaceWith(this.grid);

    // 1) Normalizar datos desde src/data/obras.js (única fuente)
    const data = Array.isArray(rawData) ? rawData : [];
    this.data = data.map(d => ({
      ...d,
      src: asset(d.src),
      title: d.title || "Obra",
      alt: d.alt || `Obra: ${d.title || "sin título"}${d.year ? ", " + d.year : ""}`,
      rcls: ratioClass(d.ratio, d.width, d.height)
    }));

    // 2) Render estricto (sin extras)
    this._render();

    // 3) Assert de columnas y ancho del grid
    this._assertGrid();
    window.addEventListener("resize", this._assertGrid, { passive: true });
  }

  destroy(){ window.removeEventListener("resize", this._assertGrid); }

  _render(){
    if (!this.data?.length) { this.grid.innerHTML = ""; this.empty?.classList.remove("hidden"); return; }
    this.empty?.classList.add("hidden");

    const frag = document.createDocumentFragment();
    this.data.forEach((item, index) => {
      const article = document.createElement("article");
      
      // Add showcase-item class and data attributes for WebGL Showcase system
      article.className = "showcase-item";
      article.dataset.imageSrc = item.src;
      article.dataset.title = item.title;
      article.dataset.aspectRatio = item.width && item.height ? (item.width / item.height).toFixed(2) : "1.33";
      article.dataset.layer = (index % 3) + 1; // Distribute across 3 layers

      // Marco por obra (no global)
      const frame = document.createElement("div");
      frame.className = "frame";

      const bar = document.createElement("div");
      bar.className = "frame-bar";
      bar.innerHTML = `
        <span class="dot dot-red" aria-hidden="true"></span>
        <span class="dot dot-yellow" aria-hidden="true"></span>
        <span class="dot dot-green" aria-hidden="true"></span>
        <span class="ml-2">${item.title}</span>
      `;

      const content = document.createElement("div");
      content.className = `card-content ${item.rcls}`;

      const sk = document.createElement("div");
      sk.className = "skel absolute inset-0 w-full h-full";

      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt;
      img.loading = "lazy";
      img.decoding = "async";
      img.fetchPriority = "low";
      if (item.width) img.width = item.width;
      if (item.height) img.height = item.height;
      img.className = "card-img";
      img.addEventListener("load", () => sk.remove());
      img.addEventListener("error", () => { sk.remove(); img.classList.add("opacity-40"); });

      article.append(frame);
      frame.append(bar, content);
      content.append(sk, img);

      // Accesibilidad mínima
      article.tabIndex = 0;
      article.setAttribute("role", "img");
      article.setAttribute("aria-label", item.alt);

      frag.appendChild(article);
    });

    this.grid.replaceChildren(frag);
    console.debug("[Portfolio] DONE — obras renderizadas:", this.grid.children.length);
  }

  _assertGrid(){
    const cw = this.grid.getBoundingClientRect().width;
    const cols = getComputedStyle(this.grid).gridTemplateColumns.split(" ").length;
    // Fallback duro si por estilos heredados quedara en 1 columna
    if (cw > 1200 && cols < 4) this.grid.style.gridTemplateColumns = "repeat(4, minmax(0,1fr))";
    else if (cw > 900 && cols < 3) this.grid.style.gridTemplateColumns = "repeat(3, minmax(0,1fr))";
    else if (cw > 600 && cols < 2) this.grid.style.gridTemplateColumns = "repeat(2, minmax(0,1fr))";
    else if (cw <= 600) this.grid.style.gridTemplateColumns = "repeat(1, minmax(0,1fr))";
  }
}
