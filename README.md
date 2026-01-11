# Plantilla Portfolio para Fotografos

Plantilla web profesional para portfolios de fotografia. Construida como Single Page Application (SPA) con arquitectura modular y animaciones fluidas.

Demo: https://andreavilaro0.github.io/plantilla/

## Que es

Una plantilla lista para usar que permite a fotografos mostrar su trabajo de forma elegante. Incluye:

- Galeria de fotos con efecto hover y posicionamiento estilo editorial
- Navegacion suave entre secciones
- Formulario de contacto con modal
- Modo claro/oscuro
- Seccion de testimonios con carrusel
- Totalmente responsive

## Stack Tecnologico

- Vite - Build tool
- Tailwind CSS v4 - Estilos
- GSAP - Animaciones
- Vanilla JavaScript - Sin frameworks

## Instalacion

1. Clona el repositorio:

```bash
git clone https://github.com/Andreavilaro0/plantilla.git
cd plantilla
```

2. Instala dependencias:

```bash
npm install
```

3. Inicia el servidor de desarrollo:

```bash
npm run dev
```

4. Abre http://localhost:5173/plantilla/ en tu navegador

## Estructura del Proyecto

```
src/
├── animations/          # Efectos GSAP (scroll, carousel, etc)
├── core/               # Router, lifecycle, constantes
├── data/
│   └── obras.js        # Datos de las fotografias
├── features/
│   ├── home/           # Vista principal
│   ├── portfolio/      # Controlador de galeria
│   └── shared/         # Componentes compartidos
├── styles/             # CSS por seccion
├── ui/                 # Navbar, modales, iconos
└── utils/              # Helpers (scroll, tema, logger)
```

## Como Personalizar

### Cambiar las fotos

Edita `src/data/obras.js`. Cada foto tiene esta estructura:

```javascript
{
  id: 1,
  title: "Titulo de la foto",
  year: 2024,
  media: "Fotografia",
  src: "https://url-de-tu-imagen.jpg",
  width: 1600,
  height: 1200,
  ratio: "4:3",
  alt: "Descripcion para accesibilidad",
  featured: true,  // destacada o no
  x: 5,            // posicion horizontal (%)
  y: 10            // posicion vertical (%)
}
```

Las imagenes pueden estar en un CDN (recomendado) o en la carpeta `public/`.

### Cambiar textos

- Hero y About: edita `src/features/home/HomeView.js`
- Testimonios: edita `src/features/shared/TestimonialsView.js`
- Footer: edita `src/features/shared/FooterView.js`

### Cambiar colores

Los colores principales estan en `src/style.css` y en los archivos de `src/styles/`.

### Cambiar tipografia

Actualiza las fuentes en `index.html` (Google Fonts) y en `tailwind.config.js`.

## Comandos

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run preview` | Preview del build |
| `npm run deploy` | Deploy a GitHub Pages |

## Deploy en GitHub Pages

1. Asegurate de que `vite.config.js` tenga el base correcto:

```javascript
export default defineConfig({
  base: '/nombre-de-tu-repo/',
  // ...
})
```

2. Ejecuta:

```bash
npm run deploy
```

3. En GitHub, ve a Settings > Pages y selecciona la rama `gh-pages`

## Caracteristicas Tecnicas

- SPA con hash routing
- Animaciones GSAP con cleanup apropiado
- Scroll suave con Lenis
- Lazy loading de imagenes
- Modo oscuro/claro persistente
- Arquitectura modular ES6
- Sin dependencias de frameworks pesados

## Licencia

Libre para uso personal y comercial. Creditos apreciados pero no requeridos.

---

Desarrollado por Andrea Avila
