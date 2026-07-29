import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // globals: false de propósito (não globals: true) — describe/it/expect sempre importados
    // explicitamente de 'vitest' em cada arquivo de teste, para ficar claro de onde vêm, sem
    // "mágica" implícita. Mesma decisão didática do projeto anterior (livu/frontend).
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    passWithNoTests: true,
  },
})
