import './style.css'
import { gsap } from 'gsap'

// Tu código aquí
console.log('¡Proyecto listo para empezar!')

// Ejemplo básico de GSAP
document.addEventListener('DOMContentLoaded', () => {
  gsap.from('h1', {
    opacity: 0,
    y: -50,
    duration: 1,
    ease: 'power2.out'
  })
})
