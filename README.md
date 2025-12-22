# Andrea Vilaró | Photography Portfolio

Portafolio fotográfico profesional construido como Single Page Application (SPA).

## 🚀 Stack Tecnológico

- **Vite** - Build tool ultrarrápido
- **Tailwind CSS v4** - Framework CSS utility-first
- **GSAP** - Animaciones profesionales
- **Vanilla JavaScript** - Sin frameworks, arquitectura modular

## 📁 Arquitectura del Proyecto

```
src/
├── controllers/
│   └── GalleryController.js    # Lógica de galería y modal
├── data/
│   └── obras.js                 # Datos de fotografías
├── views/
│   ├── HomeView.js             # Vista principal con galería
│   ├── AboutView.js            # Vista sobre mí
│   └── ContactView.js          # Vista de contacto
├── router.js                    # Sistema de routing SPA
├── scroll-animacion.js          # (Opcional) Locomotive Scroll
├── main.js                      # Entry point
└── style.css                    # Estilos globales
```

## 🎯 Características

### ✅ Single Page Application

- Navegación sin recargas
- Historial del navegador funcional
- URLs limpias

### ✅ Separación de Datos y Vista

- Datos en `src/data/obras.js`
- Vistas generadas dinámicamente
- Fácil de mantener y escalar

### ✅ Galería Interactiva

- Grid responsive
- Efecto hover grayscale
- Click para ampliar imagen

### ✅ Modal con Navegación

- Apertura con animación GSAP (zoom/fade)
- Navegación entre fotos (prev/next)
- Cierre con Escape
- Flechas del teclado funcionales

### ✅ Animaciones GSAP

- Header con stagger animation
- Cards con scroll trigger
- Modal con transiciones suaves
- Cambio de imagen fluido

## 🛠️ Comandos

### Desarrollo

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Deploy a GitHub Pages

```bash
npm run deploy
```

## 📝 Cómo Agregar Fotos

1. Abre `src/data/obras.js`
2. Agrega un nuevo objeto al array:

```javascript
{
  id: 10,
  titulo: "Nueva Foto",
  year: "2024",
  categoria: "Categoría",
  img: "URL_DE_LA_IMAGEN"
}
```

3. ¡Listo! La galería se actualiza automáticamente

## 🎨 Personalización

### Cambiar Colores

Edita las variables en `src/style.css`:

```css
@theme {
  --color-dark-bg: #0b0b0b;
  --color-modal-bg: #1a1a1a;
}
```

### Cambiar Fuente

Actualiza en `index.html` y `style.css`:

```css
--font-serif: "Playfair Display", "Times New Roman", serif;
```

## 🔧 Controladores

### GalleryController

Maneja toda la lógica interactiva:

- Animaciones de entrada
- Click en imágenes
- Modal open/close
- Navegación prev/next
- Keyboard shortcuts

## 📱 Responsive

- Mobile First
- Grid adaptativo
- Touch friendly

---

Creado con 💜 por Andrea Vilaró
