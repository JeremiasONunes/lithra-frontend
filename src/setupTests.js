import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Sem `globals: true` no Vitest (ver vite.config.js) — o cleanup entre testes não se registra
// sozinho, precisa ser feito explicitamente aqui.
afterEach(() => {
  cleanup()
})
