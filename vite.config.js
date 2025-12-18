import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/plantilla/',
  plugins: [
    tailwindcss(),
  ],
  server: {
    historyApiFallback: true
  }
})
