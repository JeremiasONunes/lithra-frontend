import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { resetMockData } from './mockStorage'
import { seguimentoService } from './seguimentoService'

describe('seguimentoService', () => {
  beforeEach(() => {
    resetMockData()
  })

  afterEach(() => {
    resetMockData()
  })

  it('listarSeguidores retorna quem segue o usuário pedido', async () => {
    const seguidores = await seguimentoService.listarSeguidores('usuario-1')
    expect(seguidores.every((seguimento) => seguimento.seguidoId === 'usuario-1')).toBe(true)
    expect(seguidores.length).toBeGreaterThan(0)
  })

  it('listarSeguindo retorna quem o usuário pedido segue', async () => {
    const seguindo = await seguimentoService.listarSeguindo('usuario-1')
    expect(seguindo.every((seguimento) => seguimento.seguidorId === 'usuario-1')).toBe(true)
    expect(seguindo.some((seguimento) => seguimento.seguidoId === 'usuario-5')).toBe(true)
  })

  it('verificarSegue retorna true quando já existe o vínculo', async () => {
    const segue = await seguimentoService.verificarSegue('usuario-1', 'usuario-2')
    expect(segue).toBe(true)
  })

  it('verificarSegue retorna false quando não existe o vínculo', async () => {
    const segue = await seguimentoService.verificarSegue('usuario-3', 'usuario-4')
    expect(segue).toBe(false)
  })

  it('seguir cria o vínculo e persiste', async () => {
    await seguimentoService.seguir('usuario-3', 'usuario-4')
    const segue = await seguimentoService.verificarSegue('usuario-3', 'usuario-4')
    expect(segue).toBe(true)
  })

  it('seguir rejeita seguir a própria conta', async () => {
    await expect(seguimentoService.seguir('usuario-1', 'usuario-1')).rejects.toThrow()
  })

  it('seguir rejeita vínculo duplicado', async () => {
    await expect(seguimentoService.seguir('usuario-1', 'usuario-2')).rejects.toThrow()
  })

  it('deixarDeSeguir remove o vínculo e persiste', async () => {
    await seguimentoService.deixarDeSeguir('usuario-1', 'usuario-2')
    const segue = await seguimentoService.verificarSegue('usuario-1', 'usuario-2')
    expect(segue).toBe(false)
  })

  it('deixarDeSeguir rejeita quando o vínculo não existe', async () => {
    await expect(seguimentoService.deixarDeSeguir('usuario-3', 'usuario-4')).rejects.toThrow()
  })

  it('dado criado sobrevive a uma releitura simulando reload', async () => {
    await seguimentoService.seguir('usuario-3', 'usuario-2')
    const seguindo = await seguimentoService.listarSeguindo('usuario-3')
    expect(seguindo.some((seguimento) => seguimento.seguidoId === 'usuario-2')).toBe(true)
  })
})
