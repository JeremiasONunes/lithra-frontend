import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { avaliacaoService } from './avaliacaoService'
import { livroService } from './livroService'
import { resetMockData } from './mockStorage'

describe('avaliacaoService', () => {
  beforeEach(() => {
    resetMockData()
  })

  afterEach(() => {
    resetMockData()
  })

  it('listarPorLivro retorna só avaliações do livro pedido', async () => {
    const avaliacoes = await avaliacaoService.listarPorLivro('livro-1')
    expect(avaliacoes.length).toBeGreaterThan(0)
    expect(avaliacoes.every((avaliacao) => avaliacao.livroId === 'livro-1')).toBe(true)
  })

  it('listarPorLivro retorna lista vazia pra livro sem avaliação (caso de borda da fixture)', async () => {
    const avaliacoes = await avaliacaoService.listarPorLivro('livro-4')
    expect(avaliacoes).toEqual([])
  })

  it('listarPorUsuario retorna só avaliações do usuário pedido', async () => {
    const avaliacoes = await avaliacaoService.listarPorUsuario('usuario-1')
    expect(avaliacoes.every((avaliacao) => avaliacao.usuarioId === 'usuario-1')).toBe(true)
  })

  it('buscarPorId encontra uma avaliação existente', async () => {
    const avaliacao = await avaliacaoService.buscarPorId('avaliacao-1')
    expect(avaliacao?.nota).toBe(5)
  })

  it('criar adiciona a avaliação e recalcula a média do livro', async () => {
    const antes = await livroService.buscarPorId('livro-4')
    expect(antes?.mediaAvaliacoes).toBe(0)
    expect(antes?.totalAvaliacoes).toBe(0)

    const nova = await avaliacaoService.criar({
      usuarioId: 'usuario-1',
      livroId: 'livro-4',
      nota: 4,
      resenha: 'Boa leitura.',
    })
    expect(nova.id).toBeTruthy()

    const depois = await livroService.buscarPorId('livro-4')
    expect(depois?.totalAvaliacoes).toBe(1)
    expect(depois?.mediaAvaliacoes).toBe(4)
  })

  it('atualizar altera a nota, recalcula a média e persiste', async () => {
    await avaliacaoService.atualizar('avaliacao-1', { nota: 1 })

    const encontrada = await avaliacaoService.buscarPorId('avaliacao-1')
    expect(encontrada?.nota).toBe(1)

    // livro-1 tinha nota 5 (avaliacao-1) e 4 (avaliacao-2); com avaliacao-1 virando 1, a média cai.
    const livro = await livroService.buscarPorId('livro-1')
    expect(livro?.mediaAvaliacoes).toBe(2.5)
  })

  it('atualizar rejeita id inexistente', async () => {
    await expect(avaliacaoService.atualizar('avaliacao-inexistente', { nota: 1 })).rejects.toThrow()
  })

  it('remover apaga a avaliação e recalcula a média do livro', async () => {
    await avaliacaoService.remover('avaliacao-1')

    const restantes = await avaliacaoService.listarPorLivro('livro-1')
    expect(restantes.some((avaliacao) => avaliacao.id === 'avaliacao-1')).toBe(false)

    // só sobra avaliacao-2 (nota 4) em livro-1.
    const livro = await livroService.buscarPorId('livro-1')
    expect(livro?.mediaAvaliacoes).toBe(4)
    expect(livro?.totalAvaliacoes).toBe(1)
  })

  it('remover rejeita id inexistente', async () => {
    await expect(avaliacaoService.remover('avaliacao-inexistente')).rejects.toThrow()
  })

  it('dado criado sobrevive a uma releitura simulando reload', async () => {
    await avaliacaoService.criar({
      usuarioId: 'usuario-1',
      livroId: 'livro-9',
      nota: 3,
      resenha: 'ok',
    })
    const avaliacoes = await avaliacaoService.listarPorLivro('livro-9')
    expect(avaliacoes.length).toBe(1)
  })
})
