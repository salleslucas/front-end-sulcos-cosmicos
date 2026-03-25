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
  },
})
