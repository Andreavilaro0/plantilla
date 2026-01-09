/**
 * Portfolio Entrance Animation
 * GSAP-based scroll-triggered stagger animation for portfolio items
 * Following Antigravity constitution: Context pattern for cleanup
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize portfolio entrance animations
 * @param {HTMLElement} container - Portfolio grid container
 * @returns {Function} Cleanup function to revert animations
 */
export function initPortfolioEntrance(container) {
  if (!container) {
    console.warn("[PortfolioEntrance] No container provided");
    return () => {};
  }

  const items = container.querySelectorAll(".obra-item");
  
  if (!items.length) {
    console.warn("[PortfolioEntrance] No portfolio items found");
    return () => {};
  }

  // Check for reduced motion preference
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
  if (prefersReduced) {
    // Immediately show items without animation
    items.forEach((item) => {
      item.style.opacity = "1";
      item.style.transform = "none";
    });
    console.log("[PortfolioEntrance] ⚡ Reduced motion - animations disabled");
    return () => {};
  }

  // GSAP Context for cleanup
  const ctx = gsap.context(() => {
    items.forEach((item, i) => {
      gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.05, // Stagger effect
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          once: true, // Only animate once
        },
      });
    });

    console.log(`[PortfolioEntrance] ✅ Animated ${items.length} items`);
  }, container);

  // Return cleanup function
  return () => {
    ctx.revert();
    console.log("[PortfolioEntrance] 🧹 Context reverted");
  };
}
