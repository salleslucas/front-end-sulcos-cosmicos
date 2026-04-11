import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // aceita conexões de fora do container
    port: 5173,
    watch: {
      usePolling: true, // necessário para hot reload funcionar no Windows/WSL
    },
    proxy: {
      // Proxy para iTunes API — evita bloqueio de CORS no browser
      '/itunes': {
        target: 'https://itunes.apple.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/itunes/, ''),
      },
    },
  },
})
