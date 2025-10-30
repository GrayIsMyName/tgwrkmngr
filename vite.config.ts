import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ВАЖНО: базовый путь для GitHub Pages
  // замените 'tgwrkmngr' на имя вашего репозитория, если измените его
  base: '/tgwrkmngr/',
})

