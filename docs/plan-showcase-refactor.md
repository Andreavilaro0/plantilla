# Portfolio/Showcase Section Overhaul - Implementation Plan

## Overview

This plan details the implementation of a WebGL-powered Portfolio/Showcase section inspired by the reference site [https://readymag.website/ICMTWD/4094373/](https://readymag.website/ICMTWD/4094373/). The goal is to replicate the smooth, inertial scroll behavior and multi-layered parallax effect while adding Antigravity-specific enhancements like floating hover effects.

### Key Observations from Reference Site

**Animation Mechanics:**

- **Entry Effect**: Staggered fade-in combined with vertical slide-up (from bottom)
- **Scroll Physics**: Inertial/Lerp-based scrolling (not instant CSS) - smooth, weighted, "buttery" feel
- **Parallax Strategy**: Multi-layered with different speed multipliers per image (foreground faster, background slower)
- **Layout**: Organic, overlapping "collage" style with window/frame aesthetic (Blender render windows)
- **No Distortion**: Clean motion without mesh warping or heavy transforms

---

## User Review Required

> [!IMPORTANT] > **WebGL Architecture Decision**: This implementation creates a **dual-layer system** where HTML elements serve as invisible scroll anchors while Three.js meshes render the actual visuals. This approach provides:
>
> - Superior performance via GPU acceleration
> - Smooth 60fps animations with Lerp smoothing
> - Advanced shader-based effects (hover, floating)
> - Potential complexity in DOM-to-WebGL coordinate synchronization
>
> **Alternative**: A pure DOM-based approach with CSS transforms would be simpler but may not achieve the same fluid feel or allow for shader-based enhancements.

> [!WARNING] > **New Dependency**: This implementation will use GSAP ScrollTrigger for scroll detection. The project already has `gsap@^3.13.0` installed, but we need to ensure ScrollTrigger plugin is imported correctly.

---

## Proposed Changes

### Component: WebGL Showcase System

#### [NEW] [Showcase.js](file:///Users/andreaavila/Documents/Universidad/ll-año/web-ll/plantilla/src/Experience/World/Showcase.js)

**Purpose**: Main class managing the 3D showcase system with scroll synchronization.

**Core Responsibilities**:

1. **Scene Management**:

   - Create Three.js scene, camera, and renderer (or integrate with existing `LiquidBackground` system)
   - Manage WebGL plane meshes for each portfolio item
   - Handle texture loading for showcase images

2. **DOM-to-WebGL Synchronization**:

   - Query `.showcase-item` DOM elements (scroll anchors)
   - Use `getBoundingClientRect()` to get screen position
   - Convert screen coordinates to WebGL world coordinates using the following formula:

     ```javascript
     // Screen to NDC (Normalized Device Coordinates)
     const ndcX = (rect.left / window.innerWidth) * 2 - 1;
     const ndcY = -(rect.top / window.innerHeight) * 2 + 1;

     // NDC to world space (considering camera FOV and distance)
     const worldX = (ndcX * viewWidth) / 2;
     const worldY = (ndcY * viewHeight) / 2;
     ```

3. **Parallax System**:

   - Assign each mesh a `parallaxFactor` (e.g., 0.5 to 1.5)
   - Apply factor to Y-position updates: `targetY = baseY * parallaxFactor`
   - Foreground images (layer 1) get factor 1.2-1.5
   - Background images (layer 2-3) get factor 0.6-0.9

4. **Lerp Animation**:

   - Implement smooth interpolation: `mesh.position.lerp(targetPosition, 0.08)`
   - Update on every frame for continuous smoothing
   - Delta time consideration for frame-rate independence

5. **Entry Animations (GSAP ScrollTrigger)**:
   - Trigger when `.showcase-item` enters viewport bottom
   - Animate mesh from `{ y: -50, opacity: 0 }` to `{ y: targetY, opacity: 1 }`
   - Stagger delay: `i * 0.15` seconds
   - Easing: `power2.out`

**Key Methods**:

```javascript
class Showcase {
  constructor(sceneManager) { ... }
  init(portfolioData) { ... }          // Create meshes from data
  createShowcaseMesh(item, index) { ... } // Create individual plane mesh
  syncToDOM() { ... }                  // Update mesh positions from DOM
  updateParallax(scrollY) { ... }      // Apply parallax offsets
  update(delta) { ... }                // Lerp positions, floating effect
  onResize() { ... }                   // Recalculate screen-to-world mapping
  destroy() { ... }                    // GSAP context cleanup
}
```

---

#### [NEW] [showcase-window-frame.glsl](file:///Users/andreaavila/Documents/Universidad/ll-año/web-ll/plantilla/src/Experience/World/shaders/showcase-window-frame.frag)

**Purpose**: Fragment shader to render the "window frame" aesthetic inspired by the Blender render windows on the reference site.

**Features**:

- 4 uniforms: `uTexture` (image), `uTime`, `uHoverIntensity`, `uOpacity`
- Window frame rendering using `uv` coordinates to draw borders
- Vignette effect to darken edges
- Hover effect: subtle glow on frame edges

**Code Structure**:

```glsl
uniform sampler2D uTexture;
uniform float uTime;
uniform float uHoverIntensity;
uniform float uOpacity;
varying vec2 vUv;

void main() {
  vec4 texColor = texture2D(uTexture, vUv);

  // Frame rendering (outline detection)
  float border = 0.02;
  float frameMask = step(vUv.x, border) + step(1.0 - border, vUv.x)
                  + step(vUv.y, border) + step(1.0 - border, vUv.y);
  frameMask = clamp(frameMask, 0.0, 1.0);

  // Hover glow
  vec3 glowColor = vec3(0.8, 0.5, 0.2); // Antigravity orange
  vec3 finalColor = mix(texColor.rgb, glowColor, frameMask * uHoverIntensity * 0.3);

  // Opacity
  float alpha = texColor.a * uOpacity;

  gl_FragColor = vec4(finalColor, alpha);
}
```

---

#### [MODIFY] [HomeView.js](file:///Users/andreaavila/Documents/Universidad/ll-año/web-ll/plantilla/src/views/HomeView.js)

**Purpose**: Add invisible HTML anchor elements for scroll synchronization.

**Changes**:

- Add a new section with class `showcase-section`
- For each portfolio item, add a `.showcase-item` div with:
  - `data-layer` attribute (1, 2, or 3 for parallax layers)
  - `data-image-src` attribute (path to image)
  - Minimal CSS: `height: 60vh`, `margin-bottom: 20vh`, `opacity: 0`, `pointer-events: none`
  - These are invisible anchors; the WebGL meshes render the actual visuals

**Example HTML Structure**:

```html
<section class="showcase-section">
  <div
    class="showcase-item"
    data-layer="1"
    data-image-src="/images/project1.jpg"
  ></div>
  <div
    class="showcase-item"
    data-layer="2"
    data-image-src="/images/project2.jpg"
  ></div>
  <!-- ...more items... -->
</section>
```

---

#### [NEW] [showcase.css](file:///Users/andreaavila/Documents/Universidad/ll-año/web-ll/plantilla/src/styles/showcase.css)

**Purpose**: Styling for the showcase section and anchor elements.

**Styles**:

```css
.showcase-section {
  position: relative;
  padding: 100vh 0; /* Extend scrollable area */
  z-index: 1;
}

.showcase-item {
  width: 60vw;
  height: 60vh;
  margin: 0 auto 20vh;
  opacity: 0; /* Invisible, only for scroll anchoring */
  pointer-events: none;
}

/* Responsive */
@media (max-width: 768px) {
  .showcase-item {
    width: 90vw;
    height: 50vh;
  }
}
```

---

#### [MODIFY] [liquid-gradient.js](file:///Users/andreaavila/Documents/Universidad/ll-año/web-ll/plantilla/src/animations/liquid-gradient.js)

**Purpose**: Refactor to allow shared Three.js scene with Showcase.

**Changes**:

1. **Extract Scene Manager**:

   - Move `renderer`, `camera`, `scene` to a new `SceneManager` class that can be shared
   - Export `SceneManager` singleton instance

2. **Integration Point**:
   - `LiquidBackground` initializes the base scene
   - `Showcase` class receives the `sceneManager` instance
   - Both render to the same canvas in the same animation loop

**Refactored Structure**:

```javascript
class SceneManager {
  constructor() {
    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.clock = new THREE.Clock();
    this.components = []; // [LiquidBackground, Showcase, ...]
  }

  init() {
    /* Init renderer, camera, scene */
  }

  addComponent(component) {
    this.components.push(component);
    component.init(this);
  }

  tick() {
    const delta = this.clock.getDelta();
    this.components.forEach((comp) => comp.update(delta));
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.tick());
  }
}

export const sceneManager = new SceneManager();
```

---

#### [MODIFY] [main.js](file:///Users/andreaavila/Documents/Universidad/ll-año/web-ll/plantilla/src/main.js)

**Purpose**: Initialize the Showcase system on app load.

**Changes**:

```javascript
import { sceneManager } from "./animations/liquid-gradient.js";
import { Showcase } from "./Experience/World/Showcase.js";

// After DOM loaded
sceneManager.init();

// Add Showcase
const showcase = new Showcase();
sceneManager.addComponent(showcase);

// Portfolio data (could be from `/src/data/portfolio.json`)
const portfolioData = [
  { imageSrc: "/images/project1.jpg", layer: 1 },
  { imageSrc: "/images/project2.jpg", layer: 2 },
  // ...
];
showcase.init(portfolioData);
```

---

### "Antigravity" Bonus: Floating Hover Effect

**Implementation**:

1. **On Mesh Creation**: Add `userData.floatOffset = Math.random() * Math.PI * 2`
2. **In Update Loop**: Apply sine wave to Y-position:
   ```javascript
   mesh.position.y += Math.sin(time + mesh.userData.floatOffset) * 0.005;
   ```
3. **On Mouse Hover**:
   - Use Raycaster to detect mesh under cursor
   - Increase `floatAmplitude` and `uHoverIntensity` uniform
   - GSAP tween: `gsap.to(mesh.material.uniforms.uHoverIntensity, { value: 1.0, duration: 0.3 })`

---

## Technical Architecture Details

### 1. DOM-to-WebGL Coordinate Synchronization

**The Challenge**: HTML uses screen-space coordinates (pixels from top-left), while Three.js uses world-space coordinates (centered at origin).

**Solution**:

```javascript
syncToDOM() {
  const items = document.querySelectorAll('.showcase-item');

  items.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const mesh = this.meshes[index];

    // Calculate center point of HTML element
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Convert to NDC (-1 to 1)
    const ndcX = (centerX / window.innerWidth) * 2 - 1;
    const ndcY = -(centerY / window.innerHeight) * 2 + 1;

    // Convert NDC to world coordinates
    const viewSize = this.getViewSize();
    const worldX = ndcX * (viewSize.width / 2);
    const worldY = ndcY * (viewSize.height / 2);

    // Apply parallax factor
    const layer = parseInt(item.dataset.layer);
    const parallaxFactor = this.getParallaxFactor(layer);

    // Set target position (lerped in update())
    mesh.userData.targetPosition = new THREE.Vector3(
      worldX,
      worldY * parallaxFactor,
      layer * -0.5 // Layer depth
    );
  });
}

getViewSize() {
  const fov = this.camera.fov * Math.PI / 180;
  const height = Math.abs(this.camera.position.z * Math.tan(fov / 2) * 2);
  return { width: height * this.camera.aspect, height };
}

getParallaxFactor(layer) {
  switch(layer) {
    case 1: return 1.3;  // Foreground (faster)
    case 2: return 1.0;  // Middle
    case 3: return 0.7;  // Background (slower)
    default: return 1.0;
  }
}
```

**Frame-by-Frame Flow**:

1. ScrollTrigger detects scroll → triggers `syncToDOM()`
2. `syncToDOM()` calculates target positions for all meshes
3. `update()` loop lerps current position towards target: `mesh.position.lerp(target, 0.08)`
4. Result: Smooth, inertial movement that tracks HTML scroll anchors

---

### 2. Shader/Material Strategy

**Option A: ShaderMaterial with Custom GLSL** (Recommended)

- Full control over rendering
- Allows window frame effect
- Hover glow effects
- Performance: Excellent

**Option B: MeshBasicMaterial with Texture**

- Simple, quick setup
- No frame effect without additional post-processing
- Performance: Excellent, but less flexible

**Decision**: Use **ShaderMaterial** with custom fragment shader (see `showcase-window-frame.glsl` above) to achieve the Blender window aesthetic and enable hover effects.

**Texture Loading Strategy**:

```javascript
const textureLoader = new THREE.TextureLoader();

createShowcaseMesh(item, index) {
  const texture = textureLoader.load(item.imageSrc);

  const geometry = new THREE.PlaneGeometry(8, 6); // Adjust aspect ratio per image
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: texture },
      uTime: { value: 0 },
      uHoverIntensity: { value: 0 },
      uOpacity: { value: 0 } // Start invisible for fade-in
    },
    vertexShader: basicVertexShader,
    fragmentShader: showcaseFragmentShader,
    transparent: true
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = { layer: item.layer, floatOffset: Math.random() * Math.PI * 2 };

  return mesh;
}
```

---

### 3. GSAP Context and Cleanup

**The Challenge**: GSAP ScrollTrigger creates event listeners that must be cleaned up on route changes or component unmount.

**Solution**: Use `gsap.context()` for automatic cleanup.

```javascript
class Showcase {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.meshes = [];
    this.gsapContext = null;
  }

  init(portfolioData) {
    // Create meshes
    portfolioData.forEach((item, i) => {
      const mesh = this.createShowcaseMesh(item, i);
      this.meshes.push(mesh);
      this.sceneManager.scene.add(mesh);
    });

    // Setup GSAP ScrollTrigger within context
    this.gsapContext = gsap.context(() => {
      this.meshes.forEach((mesh, i) => {
        gsap.fromTo(
          mesh.material.uniforms.uOpacity,
          { value: 0 },
          {
            value: 1,
            scrollTrigger: {
              trigger: `.showcase-item:nth-child(${i + 1})`,
              start: "top bottom",
              end: "center center",
              scrub: true,
              onUpdate: () => this.syncToDOM(), // Sync positions on scroll
            },
          }
        );
      });
    });
  }

  destroy() {
    // Cleanup GSAP
    if (this.gsapContext) {
      this.gsapContext.revert(); // Kills all animations and ScrollTriggers
    }

    // Cleanup Three.js
    this.meshes.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
      if (mesh.material.uniforms.uTexture.value) {
        mesh.material.uniforms.uTexture.value.dispose();
      }
      this.sceneManager.scene.remove(mesh);
    });

    this.meshes = [];
  }
}
```

**Cleanup Triggers**:

- On route change (if using SPA routing)
- On window unload
- Manual call to `showcase.destroy()`

---

## Verification Plan

### Automated Tests

> [!NOTE]
> This is primarily a visual/interactive feature, so automated tests are limited. Most verification will be manual.

**1. Coordinate Conversion Unit Test** (Optional - if time permits)

```javascript
// tests/showcase-sync.test.js
import { Showcase } from "../src/Experience/World/Showcase.js";

test("DOM to WebGL coordinate conversion", () => {
  const showcase = new Showcase(mockSceneManager);
  const worldPos = showcase.screenToWorld(100, 200, 1920, 1080);

  expect(worldPos.x).toBeCloseTo(-expectedX, 2);
  expect(worldPos.y).toBeCloseTo(expectedY, 2);
});
```

**Command**: (If implementing) `npm test`

---

### Manual Verification

#### **Test 1: Scroll Synchronization**

1. Run dev server: `npm run dev`
2. Navigate to the Portfolio/Showcase section
3. **Expected**: As you scroll down, WebGL planes (images) should smoothly follow their corresponding invisible HTML anchor positions
4. **Check**: No "popping" or misalignment between scroll position and mesh position

---

#### **Test 2: Parallax Effect**

1. While scrolling through the showcase section, observe multiple images at once
2. **Expected**:
   - Foreground images (layer 1) move faster than your scroll speed
   - Background images (layer 3) move slower
   - Creates a sense of 3D depth
3. **Check**: Different layers have visibly different movement speeds

---

#### **Test 3: Entry Animation**

1. Scroll from top of page slowly down to showcase section
2. **Expected**:
   - Images fade in from opacity 0 to 1
   - Staggered timing (not all at once)
   - Smooth easing (not linear)
3. **Check**: Animation feels premium, not abrupt

---

#### **Test 4: Inertial Scroll (The "Feel")**

1. Scroll quickly through the showcase section, then stop
2. **Expected**:
   - Meshes continue to "glide" for a moment before settling (lerp effect)
   - Smooth, weighted feel (like the reference site)
   - No jitter or stuttering
3. **Check**: Feels like high-quality animation, not instant CSS snapping

---

#### **Test 5: Floating Hover Effect (Antigravity Bonus)**

1. Hover mouse over a showcase image
2. **Expected**:
   - Subtle floating/bobbing animation intensifies
   - Window frame glows slightly (orange/warm color)
   - Smooth transition (GSAP easing)
3. **Check**: Effect is noticeable but not distracting

---

#### **Test 6: Performance**

1. Open DevTools → Performance tab
2. Scroll through showcase section while recording
3. **Expected**:
   - Consistent 60 FPS
   - No frame drops during scroll
   - GPU usage reasonable (not maxing out)
4. **Check**: Performance metrics show green bars, no red warnings

---

#### **Test 7: Responsive Design**

1. Resize browser window from desktop (1920px) to mobile (375px)
2. **Expected**:
   - Showcase items resize proportionally
   - No horizontal overflow
   - Parallax effect still works (maybe reduced intensity on mobile)
3. **Check**: Layout adapts without breaking

---

#### **Test 8: Cleanup (Memory Leaks)**

1. Navigate to showcase section
2. Navigate away (to another page/section)
3. Return to showcase section
4. Repeat 5-10 times
5. Open DevTools → Memory tab, take heap snapshot
6. **Expected**: Memory usage should stabilize, not continuously grow
7. **Check**: No significant memory leaks from ScrollTrigger or Three.js objects

---

### Browser Testing

**Run on**:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

**Focus**:

- WebGL compatibility
- Scroll performance on mobile
- Touch gesture support (if applicable)

---

## File Structure Summary

```
plantilla/
├── docs/
│   └── plan-showcase-refactor.md (this file)
├── src/
│   ├── Experience/
│   │   └── World/
│   │       ├── Showcase.js (NEW)
│   │       └── shaders/
│   │           ├── showcase.vert (NEW)
│   │           └── showcase.frag (NEW)
│   ├── animations/
│   │   └── liquid-gradient.js (MODIFIED - extract SceneManager)
│   ├── styles/
│   │   └── showcase.css (NEW)
│   ├── views/
│   │   └── HomeView.js (MODIFIED - add anchor elements)
│   └── main.js (MODIFIED - initialize Showcase)
└── public/
    └── images/ (portfolio images)
```

---

## Next Steps After Approval

1. ✅ Get user approval on this plan
2. Create `src/Experience/World/` directory structure
3. Implement `SceneManager` refactor in `liquid-gradient.js`
4. Build `Showcase.js` class with core methods
5. Write GLSL shaders for window frame effect
6. Add HTML anchor elements to `HomeView.js`
7. Integrate with `main.js` initialization
8. Test synchronization and parallax
9. Fine-tune lerp values and animation timings
10. Add Antigravity floating hover effect
11. Responsive styling and mobile optimization
12. Performance profiling and optimization
13. Cross-browser testing

---

## Questions for User

1. **Portfolio Data Source**: Should portfolio images be loaded from a JSON file (`/src/data/portfolio.json`), or hardcoded in `main.js`?
2. **Image Aspect Ratio**: Should all showcase images use the same aspect ratio (e.g., 4:3), or should each mesh adapt to its texture's native ratio?
3. **Mobile Behavior**: Should we reduce parallax intensity on mobile for performance, or keep the full effect?
4. **Layer Count**: The reference site has 3 layers. Should we stick with 3, or allow configurable layer count?
5. **Frame Aesthetic**: Do you want the exact "Blender render window" style from the reference (with top bar, buttons, etc.), or a simpler frame/border?
