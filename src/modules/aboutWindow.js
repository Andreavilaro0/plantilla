import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

export function initAboutWindow() {
  const windowEl = document.getElementById('aboutWindow');
  const titlebar = windowEl?.querySelector('.mac-titlebar');
  const section = document.getElementById('about');

  if (!windowEl || !titlebar || !section) return;

  // Initialize Draggable
  Draggable.create(windowEl, {
    type: 'x,y',
    trigger: titlebar,
    bounds: section,
    inertia: true, // Optional: adds a nice feel if inertia plugin is available, otherwise it just stops
    onDragStart: function() {
      gsap.to(this.target, { scale: 1.02, boxShadow: '0 40px 80px -15px rgba(0, 0, 0, 0.6)', duration: 0.3 });
    },
    onDragEnd: function() {
      gsap.to(this.target, { scale: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', duration: 0.3 });
    }
  });

  // Optional: Add a subtle entry animation for the window
  gsap.from(windowEl, {
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: 'power4.out',
    delay: 0.5
  });
}

