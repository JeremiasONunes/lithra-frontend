import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Sem `globals: true` no Vitest (ver vite.config.js) — o cleanup entre testes não se registra
// sozinho, precisa ser feito explicitamente aqui.
afterEach(() => {
  cleanup()
})

// jsdom não implementa `IntersectionObserver` (usado pelo lazy load do Feed, Etapa 14) — sem esse
// stub, qualquer teste que renderize `FeedPage` quebraria com "IntersectionObserver is not
// defined". `observe`/`disconnect` só precisam existir (não disparar interseção de verdade); nenhum
// teste depende do carregamento automático de fato acontecer via scroll simulado.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.IntersectionObserver = IntersectionObserverStub
