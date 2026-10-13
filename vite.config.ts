import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages sirve el sitio bajo /<repo>/
  base: '/habitar-juntos/',
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1200,
  },
})
