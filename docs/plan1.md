# Plan 1: Limpieza y Optimizacion del Portfolio

## Objetivo Principal

Limpiar todo el codigo no utilizado y mejorar tanto la estructura del proyecto como la rapidez de carga y ejecucion.

## Contexto del Proyecto

- **Stack**: Vite + Vanilla JS + GSAP + Tailwind CSS
- **Tipo**: Portfolio de fotografia profesional
- **Requisitos**: Mantener el diseno visual intacto mientras se optimiza el codigo

## Backlog de Limpieza Identificado

### A) Codigo Muerto / No Usado

| Item | Descripcion | Prioridad |
|------|-------------|-----------|
| `InlineIcons` import | Import no utilizado en HomeView.js | Alta |
| `log` import | Import de logger no utilizado | Media |
| `generateAltText()` | Funcion definida pero nunca llamada | Alta |
| `ScrollToPlugin` | Plugin GSAP registrado sin uso | Media |
| `Flip` | Plugin GSAP registrado sin uso | Media |

### B) Componentes Sin Referencias

| Archivo | Razon de Eliminacion |
|---------|---------------------|
| `ContactCTA.js` | Sin imports en el proyecto |
| `InlineIcons.js` | Sin referencias |
| `CameraIllustration.js` | Sin referencias |
| `PortfolioBackgroundText.js` | Sin referencias |
| `ParallaxController.js` | Sin referencias |

### C) CSS Huerfano

| Archivo | Estado |
|---------|--------|
| `contact.css` | No importado en ningun lugar |
| `helpers.css` | Utilidades sin uso en templates |

### D) Optimizaciones GSAP

| Item | Problema | Solucion Propuesta |
|------|----------|-------------------|
| `bounce-entrance` | ScrollTrigger sin ID | Agregar ID para cleanup |
| `pixel-reveal` | Listeners sin cleanup | Implementar destroy() |
| `testimonial-carousel` | Resize listener sin destroy | Agregar al metodo destroy() |
| `navbar.js` | Scroll handler pesado | Implementar throttle/rAF |

### E) Housekeeping

- Verificar `.DS_Store` no trackeados en git
- Confirmar `dist/` y `node_modules/` en `.gitignore`
- Limpiar archivos temporales

## Restricciones

1. **NO tocar el router** - Decision explicita del desarrollador
2. **NO cambiar el diseno** - Layout, tipografia, colores, espaciados deben permanecer identicos
3. **Verificacion visual obligatoria** tras cada cambio

## Metodologia

1. Crear baseline visual antes de cualquier cambio
2. Aplicar cambios en micro-incrementos
3. Verificar visualmente tras cada eliminacion
4. Documentar cada cambio y su resultado

## Colaboracion Humano-IA

- **Decisiones del desarrollador**: Parte visual/artistica, diseno, estructura del codigo
- **Asistencia de IA**: Integracion de animaciones encontradas en internet, verificacion de que los cambios no rompan funcionalidad
- **Aspecto mas relevante para evaluacion**: Uso de routers y estructura del proyecto
