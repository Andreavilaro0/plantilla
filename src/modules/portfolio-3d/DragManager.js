/**
 * DragManager.js - Helper for managing draggable cards
 */

import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

/**
 * Create draggable instances for cards
 */
export function createDraggables(cards, containerId) {
  const draggables = [];
  
  cards.forEach(card => {
    const draggable = Draggable.create(card, {
      type: 'x,y',
      edgeResistance: 0.65,
      bounds: `#${containerId}`,
      inertia: true,
      zIndexBoost: false,
      allowContextMenu: true,
      onClick: function() {
        console.log('Single click on card');
      },
      onPress: function() {
        gsap.to(this.target, {
          scale: 1.05,
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          duration: 0.2,
          zIndex: 100
        });
      },
      onDrag: function() {
        // Optional: Add visual feedback during drag
      },
      onRelease: function() {
        gsap.to(this.target, {
          scale: 1,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          duration: 0.3,
          zIndex: 'auto'
        });
      }
    })[0];
    
    draggables.push(draggable);
  });
  
  return draggables;
}

/**
 * Kill all draggable instances
 */
export function killDraggables(draggables) {
  draggables.forEach(d => d.kill());
}
