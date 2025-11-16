import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Expose process.env.API_KEY to the client-side code.
  // This is a direct replacement at build time, so the key will be
  // embedded in the final JavaScript bundle.
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})
