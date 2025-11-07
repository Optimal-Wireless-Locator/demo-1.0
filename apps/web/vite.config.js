import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/places': 'http://localhost:3000',
      '/devices': 'http://localhost:3000',
      '/locations': 'http://localhost:3000',
      '/location': 'http://localhost:3000',
      '/readings': 'http://localhost:3000'
    }
  }
})
