import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

import { routeConfig } from './routeConfig'
import { sessaoMock } from './guards/sessionStub'

/** `createMemoryRouter` (não `createBrowserRouter` de `AppRoutes.jsx`) pra controlar a URL inicial
 * de cada teste sem depender de `window.location`. `sessaoMock` é mutado direto — é o mesmo objeto
 * que os guards leem, mockado até a Etapa 8 trazer o `AuthContext` real. */
function renderEm(caminhoInicial) {
  const router = createMemoryRouter(routeConfig, { initialEntries: [caminhoInicial] })
  render(<RouterProvider router={router} />)
}

beforeEach(() => {
  sessaoMock.autenticado = false
  sessaoMock.papel = null
})

describe('AppRoutes', () => {
  it('renderiza o placeholder de uma rota pública', () => {
    renderEm('/login')

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
  })

  it('redireciona pra /login ao acessar rota de leitor sem sessão', () => {
    renderEm('/feed')

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
  })

  it('permite leitor autenticado acessar rota de leitor', () => {
    sessaoMock.autenticado = true
    sessaoMock.papel = 'leitor'
    renderEm('/estante')

    expect(screen.getByRole('heading', { name: 'Estante' })).toBeInTheDocument()
  })

  it('redireciona pra /nao-autorizado quando leitor tenta acessar rota de admin', () => {
    sessaoMock.autenticado = true
    sessaoMock.papel = 'leitor'
    renderEm('/admin')

    expect(screen.getByRole('heading', { name: 'Acesso não autorizado' })).toBeInTheDocument()
  })

  it('permite administrador acessar rota de admin', () => {
    sessaoMock.autenticado = true
    sessaoMock.papel = 'administrador'
    renderEm('/admin')

    expect(screen.getByRole('heading', { name: 'Painel administrativo' })).toBeInTheDocument()
  })

  it('rota desconhecida cai no catch-all (404)', () => {
    renderEm('/rota-que-nao-existe')

    expect(screen.getByRole('heading', { name: 'Página não encontrada' })).toBeInTheDocument()
  })
})
