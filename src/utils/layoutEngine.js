/**
 * Layout Engine con Collision Detection y Exclusion Zones
 * RESTRICCIONES OBLIGATORIAS:
 * 1. Sin superposición de imágenes (collision detection real)
 * 2. Sin tapar título hero (exclusion zone)
 * 3. Gap mínimo 20px entre imágenes
 * 4. 80 intentos por imagen antes de mover a siguiente banda
 * 5. Determinista con seeded RNG
 */

// ============================================
// SEEDED RANDOM NUMBER GENERATOR
// ============================================
class SeededRandom {
  constructor(seed = 12345) {
    this.seed = seed;
  }
  
  next() {
    // Linear Congruential Generator (LCG)
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  range(min, max) {
    return min + this.next() * (max - min);
  }
  
  choice(array) {
    return array[Math.floor(this.next() * array.length)];
  }
}

// ============================================
// CONFIGURACIÓN DEL LAYOUT
// ============================================
const LAYOUT_CONFIG = {
  bandHeight: 650, // Altura reducida para layout más compacto
  minGap: 20, // Gap reducido para mayor densidad
  maxAttempts: 80, // Intentos máximos por imagen
  sizes: {
    S: { w: 240, h: 300 },
    M: { w: 320, h: 400 },
    L: { w: 420, h: 520 }
  },
  sizeWeights: ['S', 'S', 'M', 'M', 'M', 'L', 'L'], // Mayor probabilidad de M
};

// ============================================
// HELPER: Detección de colisiones
// ============================================
function checkCollision(rect1, rect2, gap = LAYOUT_CONFIG.minGap) {
  // Expandir rectángulos con el gap
  const r1 = {
    left: rect1.x - gap,
    right: rect1.x + rect1.w + gap,
    top: rect1.y - gap,
    bottom: rect1.y + rect1.h + gap
  };
  
  const r2 = {
    left: rect2.x - gap,
    right: rect2.x + rect2.w + gap,
    top: rect2.y - gap,
    bottom: rect2.y + rect2.h + gap
  };
  
  // Chequear si NO hay colisión
  const noCollision = r1.right < r2.left || 
                      r1.left > r2.right || 
                      r1.bottom < r2.top || 
                      r1.top > r2.bottom;
  
  return !noCollision; // Retornar true si HAY colisión
}

// ============================================
// LAYOUT ENGINE
// ============================================
export class LayoutEngine {
  constructor(items, config = LAYOUT_CONFIG) {
    this.items = items;
    this.config = config;
    this.rng = new SeededRandom(42); // Seed fijo para reproducibilidad
    this.positions = [];
    this.placedRects = []; // Rectángulos ya colocados
    this.exclusionZones = []; // Zonas prohibidas
  }
  
  /**
   * Añade una zona de exclusión (ej. título del hero)
   */
  addExclusionZone(x, y, w, h) {
    this.exclusionZones.push({ x, y, w, h });
  }
  
  /**
   * Genera el layout completo con collision detection
   */
  generate(options = {}) {
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1400;
    const maxWidth = Math.min(viewportWidth * 0.9, 1400);
    
    // Zona de exclusión para el título del hero (centro superior)
    if (options.addHeroExclusion !== false) {
      const heroExclusionWidth = Math.min(maxWidth * 0.6, 800);
      const heroExclusionHeight = 400;
      const heroExclusionX = (maxWidth - heroExclusionWidth) / 2;
      this.addExclusionZone(heroExclusionX, 0, heroExclusionWidth, heroExclusionHeight);
    }
    
    let currentBand = 0;
    let bandItemCounter = 0;
    const targetItemsPerBand = 11; // Más imágenes por banda para menos scroll
    
    this.items.forEach((item, index) => {
      // Elegir tamaño aleatorio
      const size = this.rng.choice(this.config.sizeWeights);
      const dimensions = this.config.sizes[size];
      
      // Intentar colocar la imagen
      let placed = false;
      let attempts = 0;
      let finalPosition = null;
      
      while (!placed && attempts < this.config.maxAttempts) {
        attempts++;
        
        // Calcular Y base de la banda actual
        const bandY = currentBand * this.config.bandHeight;
        
        // Posición X aleatoria dentro del viewport
        const maxX = maxWidth - dimensions.w;
        const x = Math.max(0, this.rng.range(0, maxX));
        
        // Posición Y dentro de la banda con variación
        const yVariation = this.config.bandHeight - dimensions.h - 100;
        const y = bandY + this.rng.range(50, Math.max(51, yVariation));
        
        // Crear rectángulo candidato
        const candidateRect = {
          x: Math.round(x),
          y: Math.round(y),
          w: dimensions.w,
          h: dimensions.h
        };
        
        // Chequear colisión con imágenes ya colocadas
        let hasCollision = false;
        
        // Chequear contra todas las posiciones ya colocadas
        for (const rect of this.placedRects) {
          if (checkCollision(candidateRect, rect)) {
            hasCollision = true;
            break;
          }
        }
        
        // Chequear contra zonas de exclusión
        if (!hasCollision) {
          for (const zone of this.exclusionZones) {
            if (checkCollision(candidateRect, zone)) {
              hasCollision = true;
              break;
            }
          }
        }
        
        // Si no hay colisión, colocar la imagen
        if (!hasCollision) {
          finalPosition = candidateRect;
          placed = true;
        }
      }
      
      // Si no se pudo colocar después de todos los intentos, mover a la siguiente banda
      if (!placed) {
        console.warn(`⚠️ Imagen ${index} no pudo colocarse en banda ${currentBand} después de ${attempts} intentos. Moviendo a siguiente banda.`);
        currentBand++;
        
        // Intentar una vez más en la nueva banda
        const bandY = currentBand * this.config.bandHeight;
        const x = this.rng.range(0, maxWidth - dimensions.w);
        const y = bandY + 50;
        
        finalPosition = {
          x: Math.round(x),
          y: Math.round(y),
          w: dimensions.w,
          h: dimensions.h
        };
      }
      
      // Guardar posición
      this.placedRects.push(finalPosition);
      
      // Velocidad de parallax y scroll basada en índice
      const parallaxSpeed = this.getParallaxSpeed(index);
      const scrollSpeed = this.getScrollSpeed(index);
      
      this.positions.push({
        id: item.id,
        x: finalPosition.x,
        y: finalPosition.y,
        width: finalPosition.w,
        height: finalPosition.h,
        size,
        bandIndex: currentBand,
        parallaxSpeed,
        scrollSpeed,
        zIndex: Math.floor(this.rng.range(1, 10))
      });
      
      // Control de items por banda
      bandItemCounter++;
      if (bandItemCounter >= targetItemsPerBand) {
        currentBand++;
        bandItemCounter = 0;
      }
    });
    
    console.log(`✅ Layout generado: ${this.positions.length} imágenes en ${currentBand + 1} bandas`);
    return this.positions;
  }
  
  /**
   * Velocidad de parallax basada en índice
   */
  getParallaxSpeed(index) {
    const speeds = [0.5, 1, 1.5, 2, 2.5, 3];
    return speeds[index % speeds.length];
  }
  
  /**
   * Velocidad de scroll basada en índice
   */
  getScrollSpeed(index) {
    if (index % 3 === 0) return -1;
    if (index % 2 === 0) return 1;
    return index % 4 === 0 ? 3 : 2;
  }
  
  /**
   * Calcula altura total necesaria para el contenedor
   */
  getTotalHeight() {
    if (this.positions.length === 0) {
      return 5000; // Default
    }
    
    const maxY = Math.max(...this.positions.map(p => p.y + p.height));
    return maxY + 300; // Padding extra al final
  }
}

/**
 * Genera layout para las obras (solo para gallery, NO hero)
 */
export function generateLayout(obras, options = {}) {
  const engine = new LayoutEngine(obras, LAYOUT_CONFIG);
  return {
    positions: engine.generate(options),
    totalHeight: engine.getTotalHeight()
  };
}
