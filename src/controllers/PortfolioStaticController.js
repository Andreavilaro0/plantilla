import { obras } from "../data/obras.js";

/**
 * Portfolio Static Controller (PASO 1)
 * Manages Portfolio section without animations - injects grid cards with proper dimensions
 * NO GSAP, NO WebGL - just stable HTML structure
 */
export class PortfolioStaticController {
  constructor(root = document.getElementById("portfolio")) {
    this.root = root;
    this.grid = root?.querySelector("#portfolio-grid");
  }

  /**
   * Mount the Portfolio static controller
   * Injects obra cards into grid with proper aspect ratios and image attributes
   */
  mount() {
    if (!this.root) {
      console.warn("⚠️ Portfolio section not found, skipping mount");
      return;
    }

    if (!this.grid) {
      console.warn("⚠️ Portfolio grid not found, skipping injection");
      return;
    }

    const frag = document.createDocumentFragment();

    (obras || []).forEach((item, index) => {
      const article = document.createElement("article");

      // Default to 4:3 aspect ratio for all cards
      const ratioClass = "aspect-4-3";

      article.className = `group relative rounded-lg overflow-hidden ${ratioClass} bg-black/20 cursor-pointer`;
      article.setAttribute("data-obra-id", item.id);
      article.setAttribute("tabindex", "0");
      article.setAttribute("role", "button");
      article.setAttribute("aria-label", `Ver detalles de ${item.titulo}`);

      // Image with proper dimensions to prevent CLS
      const img = document.createElement("img");
      img.src = `${item.img}?tr=w-600,fo-auto`;
      img.alt = this._genAlt(item);
      img.loading = index < 8 ? "eager" : "lazy"; // Eager load first 8 for LCP
      img.width = 600;
      img.height = 450; // 4:3 ratio (600 * 3/4 = 450)
      img.className = "absolute inset-0 w-full h-full object-cover";

      // Overlay gradient on hover
      const overlay = document.createElement("div");
      overlay.className =
        "absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none";

      // Title header at bottom
      const header = document.createElement("header");
      header.className = "absolute bottom-0 left-0 p-4 text-white pointer-events-none";
      header.innerHTML = `
        <h3 class="text-base font-medium">${item.titulo}</h3>
        <p class="text-sm text-white/80">${item.categoria} • ${item.year}</p>
      `;

      article.appendChild(img);
      article.appendChild(overlay);
      article.appendChild(header);
      frag.appendChild(article);
    });

    this.grid.replaceChildren(frag);
    this._assertLayout();

    console.log(`✅ Portfolio static controller mounted (${obras.length} obras)`);
  }

  /**
   * Generate descriptive ALT text for accessibility
   * @private
   */
  _genAlt(obra) {
    const categoryMap = {
      Paisaje: "Fotografía de paisaje",
      Abstracto: "Composición abstracta",
      Urbano: "Fotografía urbana",
      Interior: "Fotografía de interior",
      Retrato: "Retrato fotográfico",
      Costero: "Fotografía costera",
      Arquitectura: "Fotografía de arquitectura",
    };
    const desc = categoryMap[obra.categoria] || "Fotografía";
    return `${desc} titulada "${obra.titulo}" del año ${obra.year}`;
  }

  /**
   * Assert layout dimensions to catch issues early
   * @private
   */
  _assertLayout() {
    const rect = this.root.getBoundingClientRect();
    if (rect.height < window.innerHeight * 0.6) {
      console.warn(
        "[Portfolio] ⚠️ Section height suspiciously low:",
        rect.height,
        "px"
      );
    }

    const firstCard = this.grid.querySelector("article");
    if (firstCard) {
      const cardRect = firstCard.getBoundingClientRect();
      if (cardRect.width === 0 || cardRect.height === 0) {
        console.error(
          "[Portfolio] ❌ Card collapsed! Check aspect ratio classes."
        );
      } else {
        console.log(
          "[Portfolio] ✅ First card dimensions:",
          `${Math.round(cardRect.width)}x${Math.round(cardRect.height)}px`
        );
      }
    }
  }

  /**
   * Destroy the Portfolio controller
   * No-op for PASO 1 (no animations to clean up)
   */
  destroy() {
    // No cleanup needed in static version
  }
}
