import * as THREE from "three";

/**
 * Portfolio WebGL Scene
 * Lightweight "weightless" particle system background for Portfolio section
 * Target: 60 FPS desktop, ≥40 FPS mobile
 */

let renderer, scene, camera, particleSystem;

/**
 * Initialize the Portfolio WebGL scene
 * @param {HTMLCanvasElement} canvas - The canvas element to render to
 */
export function initPortfolioScene(canvas) {
  if (!canvas) {
    console.warn('⚠️ Portfolio canvas not provided');
    return;
  }

  const { width, height } = canvas.getBoundingClientRect();
  
  if (width === 0 || height === 0) {
    console.warn('⚠️ Portfolio canvas has 0 dimensions, aborting init');
    return;
  }

  // Renderer setup with alpha for transparency
  renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: true, 
    alpha: true,
    powerPreference: 'high-performance'
  });
  
  // Cap pixel ratio for performance
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height, false);

  // Scene setup
  scene = new THREE.Scene();

  // Camera setup - PerspectiveCamera for depth
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 5);

  // Create particle system with "weightless" aesthetic
  createParticleSystem();

  // Start animation loop
  renderer.setAnimationLoop((time) => {
    if (!particleSystem) return;
    
    // Subtle rotation for "weightless" drift effect
    particleSystem.rotation.y += 0.0006;
    particleSystem.rotation.x += 0.0003;
    
    renderer.render(scene, camera);
  });

  console.log('✅ Portfolio WebGL scene initialized');
}

/**
 * Create the particle system
 */
function createParticleSystem() {
  const particleCount = 800;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  
  // Distribute particles in 3D space
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 6; // X: -3 to 3
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4; // Y: -2 to 2
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2; // Z: -1 to 1
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const material = new THREE.PointsMaterial({
    size: 0.02,
    transparent: true,
    opacity: 0.7,
    color: 0xffffff,
    sizeAttenuation: true
  });
  
  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

/**
 * Resize the Portfolio scene
 * @param {HTMLCanvasElement} canvas - The canvas element
 */
export function resizePortfolioScene(canvas) {
  if (!renderer || !camera || !canvas) return;
  
  const { width, height } = canvas.getBoundingClientRect();
  
  if (width === 0 || height === 0) return;
  
  renderer.setSize(width, height, false);
  camera.aspect = width / height || 1;
  camera.updateProjectionMatrix();
}

/**
 * Destroy the Portfolio scene - STRICT CLEANUP
 * Disposes all geometries, materials, and textures to prevent memory leaks
 */
export function destroyPortfolioScene() {
  console.log('🧹 Cleaning up Portfolio WebGL scene');
  
  // Stop animation loop first
  if (renderer) {
    renderer.setAnimationLoop(null);
  }
  
  // Dispose scene objects
  if (scene) {
    scene.traverse((obj) => {
      // Dispose geometries
      if (obj.geometry) {
        obj.geometry.dispose();
      }
      
      // Dispose materials
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(material => {
            disposeMaterial(material);
          });
        } else {
          disposeMaterial(obj.material);
        }
      }
      
      // Dispose textures
      if (obj.texture) {
        obj.texture.dispose();
      }
    });
    
    // Clear the scene
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
  }
  
  // Dispose renderer
  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
  }
  
  // Nullify references for garbage collection
  renderer = null;
  scene = null;
  camera = null;
  particleSystem = null;
  
  console.log('✅ Portfolio WebGL scene destroyed');
}

/**
 * Helper to dispose material and its textures
 * @param {THREE.Material} material
 */
function disposeMaterial(material) {
  if (!material) return;
  
  // Dispose textures
  if (material.map) material.map.dispose();
  if (material.lightMap) material.lightMap.dispose();
  if (material.bumpMap) material.bumpMap.dispose();
  if (material.normalMap) material.normalMap.dispose();
  if (material.specularMap) material.specularMap.dispose();
  if (material.envMap) material.envMap.dispose();
  
  // Dispose material itself
  material.dispose();
}
