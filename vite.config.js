import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/chapter-4-ion-move-exp/',
  plugins: [react()],
})
