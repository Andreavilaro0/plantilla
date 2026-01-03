import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Import shaders
import showcaseVertexShader from './shaders/showcase.vert?raw';
import showcaseFragmentShader from './shaders/showcase.frag?raw';

/**
 * Showcase Class
 * Manages WebGL planes that display portfolio items with Blender-style window frames
 * Syncs with HTML "ghost elements" for scroll-driven animations
 */
export class Showcase {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.group = new THREE.Group();
    this.meshes = [];
    this.ghostElements = [];
    this.textureLoader = new THREE.TextureLoader();
    this.gsapContext = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredMesh = null;
    
    // Animation parameters
    this.lerpFactor = 0.08; // Smoothness of position interpolation
    this.floatSpeed = 1.5; // Speed of floating animation
    this.floatAmplitude = 0.01; // Amplitude of floating animation
    
    // Bind methods
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  /**
   * Initialize the showcase with project data
   * @param {Array} projects - Array of { imageSrc, title, aspectRatio, layer }
   */
  init(projects) {
    console.log('🎨 Initializing Showcase with', projects.length, 'projects');
    
    // Query ghost elements from DOM
    this.ghostElements = Array.from(document.querySelectorAll('.showcase-item'));
    
    if (this.ghostElements.length === 0) {
      console.warn('⚠️ No .showcase-item elements found in DOM');
      return;
    }
    
    // Create meshes for each project
    projects.forEach((project, index) => {
      const mesh = this.createShowcaseMesh(project, index);
      this.meshes.push(mesh);
      this.group.add(mesh);
    });
    
    // Add group to scene
    this.sceneManager.scene.add(this.group);
    
    // Setup scroll-triggered animations
    this.setupScrollTriggers();
    
    // Setup mouse interaction for hover effects
    window.addEventListener('mousemove', this.onMouseMove);
    
    console.log('✅ Showcase initialized with', this.meshes.length, 'meshes');
  }

  /**
   * Create a single showcase mesh with Blender window shader
   * @param {Object} project - { imageSrc, title, aspectRatio, layer }
   * @param {Number} index - Index of the project
   * @returns {THREE.Mesh}
   */
  createShowcaseMesh(project, index) {
    const aspectRatio = project.aspectRatio || 1.5; // Default 3:2 ratio
    const width = 6;
    const height = width / aspectRatio;
    
    // Create geometry
    const geometry = new THREE.PlaneGeometry(width, height, 1, 1);
    
    // Load texture
    const texture = this.textureLoader.load(project.imageSrc, (loadedTexture) => {
      console.log(`✅ Loaded texture: ${project.imageSrc}`);
    });
    texture.colorSpace = THREE.SRGBColorSpace;
    
    // Create shader material with Blender window frame
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uHover: { value: 0.0 },
        uOpacity: { value: 0.0 }, // Start invisible for fade-in
        uTime: { value: 0.0 }
      },
      vertexShader: showcaseVertexShader,
      fragmentShader: showcaseFragmentShader,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    
    // Store metadata
    mesh.userData = {
      project,
      index,
      layer: project.layer || 1,
      floatOffset: Math.random() * Math.PI * 2, // Random phase for floating
      targetPosition: new THREE.Vector3(),
      targetOpacity: 0,
      isVisible: false
    };
    
    // Initial position (off-screen below)
    mesh.position.set(0, -20, -mesh.userData.layer * 0.5);
    
    return mesh;
  }

  /**
   * Setup GSAP ScrollTrigger for entry animations
   */
  setupScrollTriggers() {
    // Create GSAP context for cleanup
    this.gsapContext = gsap.context(() => {
      this.meshes.forEach((mesh, index) => {
        const ghostElement = this.ghostElements[index];
        
        if (!ghostElement) {
          console.warn(`⚠️ No ghost element found for mesh ${index}`);
          return;
        }
        
        // Fade-in + Slide-up animation
        ScrollTrigger.create({
          trigger: ghostElement,
          start: 'top bottom', // When top of element hits bottom of viewport
          end: 'center center', // When center of element hits center of viewport
          scrub: 1, // Smooth scrubbing
          onUpdate: (self) => {
            // Update target opacity based on scroll progress
            mesh.userData.targetOpacity = self.progress;
            mesh.userData.isVisible = self.progress > 0;
            
            // Sync position to DOM
            this.syncMeshToDOM(mesh, ghostElement, self.progress);
          },
          onEnter: () => {
            mesh.userData.isVisible = true;
          },
          onLeaveBack: () => {
            mesh.userData.isVisible = false;
          }
        });
      });
    });
  }

  /**
   * Synchronize mesh position to its corresponding DOM ghost element
   * @param {THREE.Mesh} mesh - The mesh to sync
   * @param {HTMLElement} ghostElement - The DOM element to sync to
   * @param {Number} progress - Animation progress (0-1)
   */
  syncMeshToDOM(mesh, ghostElement, progress) {
    const rect = ghostElement.getBoundingClientRect();
    
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
    
    // Apply parallax factor based on layer
    const parallaxFactor = this.getParallaxFactor(mesh.userData.layer);
    
    // Add slide-up offset for entry animation
    const slideUpOffset = (1 - progress) * 3; // 3 units slide-up
    
    // Set target position
    mesh.userData.targetPosition.set(
      worldX,
      worldY * parallaxFactor - slideUpOffset,
      -mesh.userData.layer * 0.5
    );
  }

  /**
   * Get parallax factor based on layer
   * @param {Number} layer - Layer number (1-3)
   * @returns {Number} - Parallax multiplier
   */
  getParallaxFactor(layer) {
    switch (layer) {
      case 1: return 1.3;  // Foreground (faster)
      case 2: return 1.0;  // Middle
      case 3: return 0.7;  // Background (slower)
      default: return 1.0;
    }
  }

  /**
   * Calculate view size in world units
   * @returns {{ width: number, height: number }}
   */
  getViewSize() {
    const camera = this.sceneManager.camera;
    const fov = camera.fov * Math.PI / 180;
    const height = Math.abs(camera.position.z * Math.tan(fov / 2) * 2);
    return { 
      width: height * camera.aspect, 
      height 
    };
  }

  /**
   * Handle mouse move for hover effects
   * @param {MouseEvent} event
   */
  onMouseMove(event) {
    // Convert to normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  /**
   * Update raycaster and check for hover
   */
  updateHover() {
    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.sceneManager.camera);
    
    // Check for intersections
    const intersects = this.raycaster.intersectObjects(this.meshes, false);
    
    // Reset previous hover
    if (this.hoveredMesh && !intersects.find(i => i.object === this.hoveredMesh)) {
      gsap.to(this.hoveredMesh.material.uniforms.uHover, {
        value: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
      this.hoveredMesh = null;
    }
    
    // Set new hover
    if (intersects.length > 0) {
      const newHover = intersects[0].object;
      if (newHover !== this.hoveredMesh) {
        this.hoveredMesh = newHover;
        gsap.to(this.hoveredMesh.material.uniforms.uHover, {
          value: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
  }

  /**
   * Update loop - called every frame
   * @param {Number} delta - Time since last frame
   */
  update(delta) {
    if (this.meshes.length === 0) return;
    
    const time = performance.now() * 0.001;
    
    // Update each mesh
    this.meshes.forEach((mesh) => {
      if (!mesh.userData.isVisible) return;
      
      // Lerp position for smooth inertial movement
      mesh.position.lerp(mesh.userData.targetPosition, this.lerpFactor);
      
      // Lerp opacity
      const currentOpacity = mesh.material.uniforms.uOpacity.value;
      mesh.material.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        currentOpacity,
        mesh.userData.targetOpacity,
        this.lerpFactor
      );
      
      // Floating animation (Antigravity bonus)
      const floatOffset = Math.sin(time * this.floatSpeed + mesh.userData.floatOffset) * this.floatAmplitude;
      mesh.position.y += floatOffset;
      
      // Update time uniform
      mesh.material.uniforms.uTime.value = time;
    });
    
    // Update hover detection
    this.updateHover();
  }

  /**
   * Handle window resize
   */
  onResize() {
    // Refresh ScrollTriggers
    ScrollTrigger.refresh();
  }

  /**
   * Cleanup and destroy
   */
  destroy() {
    console.log('🧹 Destroying Showcase');
    
    // Remove mouse listener
    window.removeEventListener('mousemove', this.onMouseMove);
    
    // Revert GSAP context (kills all ScrollTriggers)
    if (this.gsapContext) {
      this.gsapContext.revert();
    }
    
    // Dispose of meshes
    this.meshes.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
      
      // Dispose texture
      if (mesh.material.uniforms.uTexture.value) {
        mesh.material.uniforms.uTexture.value.dispose();
      }
    });
    
    // Remove group from scene
    this.sceneManager.scene.remove(this.group);
    
    // Clear arrays
    this.meshes = [];
    this.ghostElements = [];
  }
}
