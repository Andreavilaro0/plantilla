import LocomotiveScroll from 'locomotive-scroll'

const scroll = new LocomotiveScroll({
  el: document.querySelector('[data-scroll-container]'),
  smooth: true,
  multiplier: 1,
  smartphone: {
    smooth: true
  },
  tablet: {
    smooth: true
  }
})

window.addEventListener('load', () => {
  scroll.update()
})

let resizeTimer
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    scroll.update()
  }, 250)
})

export default scroll
