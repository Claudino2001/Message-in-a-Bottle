import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true, // Libera o ngrok
    proxy: {
      // Redireciona as rotas da API para o Backend local
      '/auth': 'http://127.0.0.1:8000',
      '/bottles': 'http://127.0.0.1:8000',
      '/admin': 'http://127.0.0.1:8000',
      '/public': 'http://127.0.0.1:8000',
    }
  }
})