import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcss from './postcss.config.js' // <-- Import the config

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: { // <-- Add this entire 'css' section
    postcss,
  },
})