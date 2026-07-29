import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

import { routeConfig } from './routeConfig'
import { AuthProvider } from '../context/AuthContext'
import { CHAVE_SESSAO } from '../context/authStorage'
import { resetMockData } from '../services/mockStorage'

/**
 * `createMemoryRouter` (não `createBrowserRouter` de `AppRoutes.jsx`) pra controlar a URL inicial de
 * cada teste sem depender de `window.location`. A partir da Etapa 8 os guards leem `AuthContext`
 * real (não mais um `sessaoMock`) — pra simular sessão, semeia `localStorage` com o `id` de um
 * usuário da fixture da Etapa 7 antes de renderizar; `AuthProvider` hidrata a partir daí, de forma
 * assíncrona, então as asserções usam `findByRole` (espera automática) em vez de `getByRole`.
 */
function renderEm(caminhoInicial, { usuarioId } = {}) {
  if (usuarioId) {
    localStorage.setItem(CHAVE_SESSAO, usuarioId)
  }

  const router = createMemoryRouter(routeConfig, { initialEntries: [caminhoInicial] })
  render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>,
  )
}

beforeEach(() => {
  resetMockData()
  localStorage.removeItem(CHAVE_SESSAO)
})

afterEach(() => {
  resetMockData()
  localStorage.removeItem(CHAVE_SESSAO)
})

describe('AppRoutes', () => {
  it('renderiza o placeholder de uma rota pública', async () => {
    renderEm('/login')

    expect(await screen.findByRole('heading', { name: 'Login' })).toBeInTheDocument()
  })

  it('redireciona pra /login ao acessar rota de leitor sem sessão', async () => {
    renderEm('/feed')

    expect(await screen.findByRole('heading', { name: 'Login' })).toBeInTheDocument()
  })

  it('permite leitor autenticado acessar rota de leitor', async () => {
    // usuario-1 (Mariana Silva) é leitor ativo na fixture da Etapa 7.
    renderEm('/estante', { usuarioId: 'usuario-1' })

    expect(await screen.findByRole('heading', { name: 'Estante' })).toBeInTheDocument()
  })

  it('redireciona pra /nao-autorizado quando leitor tenta acessar rota de admin', async () => {
    renderEm('/admin', { usuarioId: 'usuario-1' })

    expect(
      await screen.findByRole('heading', { name: 'Acesso não autorizado' }),
    ).toBeInTheDocument()
  })

  it('permite administrador acessar rota de admin', async () => {
    // usuario-6 (Equipe Lythra) é administrador na fixture da Etapa 7.
    renderEm('/admin', { usuarioId: 'usuario-6' })

    expect(
      await screen.findByRole('heading', { name: 'Painel administrativo' }),
    ).toBeInTheDocument()
  })

  it('rota desconhecida cai no catch-all (404)', async () => {
    renderEm('/rota-que-nao-existe')

    expect(
      await screen.findByRole('heading', { name: 'Página não encontrada' }),
    ).toBeInTheDocument()
  })
})
