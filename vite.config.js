import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base:"/Amazon-2024-clone/",
  server:{
    port:1212
  }
})
