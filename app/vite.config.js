import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  root: 'app',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('react-router-dom')) {
            return 'react'
          }

          if (id.includes('framer-motion') || id.includes('motion-dom')) {
            return 'motion'
          }

          if (id.includes('lucide-react') || id.includes('swiper')) {
            return 'ui'
          }
        },
      },
    },
  },
})
