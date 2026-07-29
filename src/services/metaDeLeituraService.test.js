import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { metaDeLeituraService } from './metaDeLeituraService'
import { resetMockData } from './mockStorage'

describe('metaDeLeituraService', () => {
  beforeEach(() => {
    resetMockData()
  })

  afterEach(() => {
    resetMockData()
  })

  it('buscarPorUsuarioEAno encontra a meta existente', async () => {
    const meta = await metaDeLeituraService.buscarPorUsuarioEAno('usuario-1', 2025)
    expect(meta?.metaLivros).toBe(20)
  })

  it('buscarPorUsuarioEAno retorna undefined pra usuário sem meta (caso de borda da fixture)', async () => {
    const meta = await metaDeLeituraService.buscarPorUsuarioEAno('usuario-3', 2025)
    expect(meta).toBeUndefined()
  })

  it('criar adiciona a meta e persiste', async () => {
    const nova = await metaDeLeituraService.criar({
      usuarioId: 'usuario-3',
      ano: 2025,
      metaLivros: 10,
    })
    expect(nova.id).toBeTruthy()

    const encontrada = await metaDeLeituraService.buscarPorUsuarioEAno('usuario-3', 2025)
    expect(encontrada?.metaLivros).toBe(10)
  })

  it('criar rejeita meta duplicada pro mesmo usuário/ano', async () => {
    await expect(
      metaDeLeituraService.criar({ usuarioId: 'usuario-1', ano: 2025, metaLivros: 5 }),
    ).rejects.toThrow()
  })

  it('atualizar altera metaLivros e persiste', async () => {
    const atualizada = await metaDeLeituraService.atualizar('meta-1', { metaLivros: 30 })
    expect(atualizada.metaLivros).toBe(30)

    const encontrada = await metaDeLeituraService.buscarPorUsuarioEAno('usuario-1', 2025)
    expect(encontrada?.metaLivros).toBe(30)
  })

  it('atualizar rejeita id inexistente', async () => {
    await expect(
      metaDeLeituraService.atualizar('meta-inexistente', { metaLivros: 1 }),
    ).rejects.toThrow()
  })

  it('dado criado sobrevive a uma releitura simulando reload', async () => {
    await metaDeLeituraService.criar({ usuarioId: 'usuario-3', ano: 2026, metaLivros: 8 })
    const meta = await metaDeLeituraService.buscarPorUsuarioEAno('usuario-3', 2026)
    expect(meta?.metaLivros).toBe(8)
  })
})
