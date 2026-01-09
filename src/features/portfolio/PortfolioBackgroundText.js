/**
 * PortfolioBackgroundText Component
 * Creates a fixed background typography element behind the portfolio grid
 * Inspired by Hannah Miles editorial photography aesthetic
 */

export class PortfolioBackgroundText {
  constructor(container, word = "IMPRESSIONS") {
    this.container = container;
    this.word = word;
    this.element = null;
  }

  mount() {
    // Create fixed background text element
    this.element = document.createElement("div");
    this.element.className = "portfolio-bg-text";
    this.element.textContent = this.word;
    this.element.setAttribute("aria-hidden", "true"); // Decorative element
    
    // Insert at the beginning of the container (behind grid)
    this.container.insertBefore(this.element, this.container.firstChild);
    
    console.log(`[PortfolioBgText] ✅ Mounted: "${this.word}"`);
  }

  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
      console.log("[PortfolioBgText] 🧹 Destroyed");
    }
  }

  updateWord(newWord) {
    if (this.element) {
      this.word = newWord;
      this.element.textContent = newWord;
      console.log(`[PortfolioBgText] Updated to: "${newWord}"`);
    }
  }
}
