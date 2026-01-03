/**
 * About Lighting - Interactive SVG Lighting Component
 * Features: Draggable icons, Draggable surface (via titlebar), and Resizable surface.
 */

import gsap from 'gsap';
import Draggable from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

// Configuration for lighting effects
const config = {
  lights: {
    light1: { label: 'camera', constant: 18, exponent: 140, color: 'white', surface: 1.5, z: 180 },
    light2: { label: 'lens', constant: 18, exponent: 140, color: 'white', surface: 1.5, z: 180 },
    light3: { label: 'flash', constant: 18, exponent: 140, color: 'white', surface: 1.5, z: 180 },
    light4: { label: 'tripod', constant: 18, exponent: 140, color: 'white', surface: 1.5, z: 180 },
  },
  resizeLimits: {
    minW: 420, minH: 320,
    maxW: 700, maxH: 560
  }
};

const SECTION_MAP = {
  light1: '#about-intro',
  light2: '#about-specialties',
  light3: '#about-workflow',
  light4: '#about-gear'
};

/**
 * Synchronize all lights based on current icon positions relative to the surface
 */
function syncAllLights() {
  const icons = document.querySelectorAll('.about-lighting .icon');
  icons.forEach(icon => syncLight(icon));
}

/**
 * Synchronize a single light position with its icon
 */
function syncLight(icon) {
  const surface = document.querySelector('.about-lighting .surface');
  if (!surface) return;

  const iconRect = icon.getBoundingClientRect();
  const surfaceRect = surface.getBoundingClientRect();

  // Calculate center of icon relative to surface
  // Use pageX/Y or relative to surface top-left
  const lightX = iconRect.left + iconRect.width * 0.5 - surfaceRect.left;
  const lightY = iconRect.top + iconRect.height * 0.5 - surfaceRect.top;

  const lightId = icon.dataset.light;
  gsap.set(`#${lightId} fePointLight`, {
    attr: { x: lightX, y: lightY }
  });
}

/**
 * Apply lighting configuration to SVG filters
 */
function applyLightingConfig() {
  for (const light of Object.keys(config.lights)) {
    const lightConfig = config.lights[light];
    gsap.set(`#${light}`, {
      attr: {
        specularConstant: lightConfig.constant,
        specularExponent: lightConfig.exponent,
        surfaceScale: lightConfig.surface,
        'lighting-color': lightConfig.color,
      }
    });
    gsap.set(`#${light} fePointLight`, {
      attr: { z: lightConfig.z }
    });
  }
}

function triggerSpotlight(activeLightId) {
  for (const lightId of Object.keys(config.lights)) {
    const isMain = lightId === activeLightId;
    
    gsap.to(`#${lightId}`, {
      attr: {
        specularConstant: isMain ? 40 : 2,
        specularExponent: isMain ? 60 : 200,
      },
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(`#${lightId}`, {
          attr: {
            specularConstant: config.lights[lightId].constant,
            specularExponent: config.lights[lightId].exponent,
          },
          duration: 1.5,
          delay: 0.5,
          ease: 'power1.inOut',
        });
      },
    });
  }
}

function scrollToSection(sectionId) {
  const scroller = document.querySelector('.about-lighting .surface-body');
  const target = document.querySelector(`.about-lighting ${sectionId}`);
  if (scroller && target) {
    const targetOffset = target.offsetTop;
    gsap.to(scroller, {
      scrollTop: targetOffset,
      duration: 1.2,
      ease: 'power4.out'
    });
  }
}

/**
 * Initialize Resizable logic using Pointer Events
 */
function initResize(surface) {
  const handles = surface.querySelectorAll('.resize-handle');
  let isResizing = false;
  let currentHandle = null;
  let initialRect = null;
  let initialPointer = null;

  const onPointerMove = (e) => {
    if (!isResizing) return;

    const dx = e.clientX - initialPointer.x;
    const dy = e.clientY - initialPointer.y;
    const handle = currentHandle.dataset.handle;

    let newW = initialRect.width;
    let newH = initialRect.height;
    let newX = initialRect.x;
    let newY = initialRect.y;

    // Corner logic (4 handles)
    if (handle.includes('e')) newW = initialRect.width + dx;
    if (handle.includes('w')) {
      newW = initialRect.width - dx;
      newX = initialRect.x + dx;
    }
    if (handle.includes('s')) newH = initialRect.height + dy;
    if (handle.includes('n')) {
      newH = initialRect.height - dy;
      newY = initialRect.y + dy;
    }

    // Apply limits
    const { minW, minH, maxW, maxH } = config.resizeLimits;
    
    // Clamp Width
    if (newW < minW) {
      if (handle.includes('w')) newX = initialRect.x + (initialRect.width - minW);
      newW = minW;
    } else if (newW > maxW) {
      if (handle.includes('w')) newX = initialRect.x + (initialRect.width - maxW);
      newW = maxW;
    }

    // Clamp Height
    if (newH < minH) {
      if (handle.includes('n')) newY = initialRect.y + (initialRect.height - minH);
      newH = minH;
    } else if (newH > maxH) {
      if (handle.includes('n')) newY = initialRect.y + (initialRect.height - maxH);
      newH = maxH;
    }

    // Apply styles via GSAP for better sync
    gsap.set(surface, {
      width: newW,
      height: newH,
      x: newX,
      y: newY
    });

    syncAllLights();
  };

  const onPointerUp = () => {
    isResizing = false;
    currentHandle = null;
    document.body.style.cursor = '';
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    
    // Re-enable surface drag
    const draggable = Draggable.get(surface);
    if (draggable) draggable.enable();
  };

  handles.forEach(handle => {
    handle.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      isResizing = true;
      currentHandle = handle;
      
      const x = gsap.getProperty(surface, 'x');
      const y = gsap.getProperty(surface, 'y');
      const rect = surface.getBoundingClientRect();
      
      initialRect = {
        width: rect.width,
        height: rect.height,
        x: x,
        y: y
      };
      
      initialPointer = { x: e.clientX, y: e.clientY };
      document.body.style.cursor = getComputedStyle(handle).cursor;

      const draggable = Draggable.get(surface);
      if (draggable) draggable.disable();

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    });
  });
}

export function initAboutLighting() {
  const container = document.querySelector('.about-lighting');
  const surface = document.querySelector('.about-lighting .surface');
  const titlebar = document.querySelector('.about-lighting .surface-titlebar');
  const icons = document.querySelectorAll('.about-lighting .icon');

  if (!container || !surface || !titlebar) return;

  applyLightingConfig();

  // Make Surface Draggable via Titlebar
  Draggable.create(surface, {
    trigger: titlebar,
    type: 'x,y',
    onDrag: syncAllLights,
    onDragStart: () => surface.classList.add('is-dragging'),
    onDragEnd: () => surface.classList.remove('is-dragging')
  });

  // Init Surface Resize
  initResize(surface);

  // Icons Interaction
  icons.forEach((icon) => {
    const lightId = icon.dataset.light;
    const sectionId = SECTION_MAP[lightId];

    Draggable.create(icon, {
      type: 'x,y',
      bounds: container,
      onDrag: () => syncLight(icon),
      onDragEnd: () => {
        scrollToSection(sectionId);
        triggerSpotlight(lightId);
      },
      onPress: function () { this.target.style.cursor = 'grabbing'; },
      onRelease: function () { this.target.style.cursor = 'grab'; },
    });

    icon.addEventListener('mouseenter', () => {
      scrollToSection(sectionId);
      gsap.to(icon, { scale: 1.1, duration: 0.3 });
    });

    icon.addEventListener('mouseleave', () => {
      gsap.to(icon, { scale: 1, duration: 0.3 });
    });

    icon.addEventListener('click', () => {
      triggerSpotlight(lightId);
      scrollToSection(sectionId);
    });

    // Initial sync
    syncLight(icon);
  });

  // Initial responsiveness
  window.addEventListener('resize', () => {
    syncAllLights();
  });

  // Small delay for layout stabilization
  setTimeout(syncAllLights, 100);

  console.log('✨ About Lighting: Fully Refactored (Drag, Resize, Scroll)');
}
