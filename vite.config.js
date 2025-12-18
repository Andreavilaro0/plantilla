// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/plantilla/', // Cambia 'plantilla' por el nombre de tu repositorio en GitHub
  plugins: [
    tailwindcss(),
  ],
})
