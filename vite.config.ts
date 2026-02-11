import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Ecoschoolia/',   // 👈 MUST match the repo name exactly (case-sensitive)
  plugins: [react()],
})
