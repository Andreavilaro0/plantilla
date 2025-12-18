// src/js/animations/scroll.js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
	// Revelado por lotes para mejor rendimiento
	ScrollTrigger.batch('[data-animate="fade-up"]', {
		onEnter: (elements) =>
			gsap.from(elements, {
				y: 30,
				opacity: 0,
				duration: 0.6,
				stagger: 0.1,
				ease: 'power2.out',
			}),
		start: 'top 90%',
		once: true,
	});

	// Capas con parallax
	gsap.utils.toArray('[data-parallax]').forEach((el) => {
		const speed = el.dataset.parallax || 0.2;
		gsap.to(el, {
			yPercent: -100 * speed,
			ease: 'none',
			scrollTrigger: {
				trigger: el.parentElement,
				start: 'top bottom',
				end: 'bottom top',
				scrub: true,
			},
		});
	});
}

export function initSmoothScroll() {
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener('click', (e) => {
			e.preventDefault();
			const target = document.querySelector(anchor.getAttribute('href'));
			if (target) {
				gsap.to(window, {
					duration: 0.8,
					scrollTo: { y: target, offsetY: 80 },
					ease: 'power2.inOut',
				});
			}
		});
	});
}