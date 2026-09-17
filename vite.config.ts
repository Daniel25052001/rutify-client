import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Configuración de Vite con soporte nativo para Tailwind CSS v4
 */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Activa el compilador optimizado de Tailwind v4
  ],
})