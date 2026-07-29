import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { itemDaEstanteService } from './itemDaEstanteService'
import { resetMockData } from './mockStorage'

describe('itemDaEstanteService', () => {
  beforeEach(() => {
    resetMockData()
  })

  afterEach(() => {
    resetMockData()
  })

  it('listarPorUsuario retorna só itens do usuário pedido', async () => {
    const itens = await itemDaEstanteService.listarPorUsuario('usuario-1')
    expect(itens.length).toBeGreaterThan(0)
    expect(itens.every((item) => item.usuarioId === 'usuario-1')).toBe(true)
  })

  it('listarPorUsuario filtra por status quando informado', async () => {
    const lendo = await itemDaEstanteService.listarPorUsuario('usuario-1', 'lendo')
    expect(lendo.every((item) => item.status === 'lendo')).toBe(true)
    expect(lendo.length).toBeGreaterThan(0)
  })

  it('listarPorUsuario retorna lista vazia pra usuário sem itens (caso de borda da fixture)', async () => {
    const itens = await itemDaEstanteService.listarPorUsuario('usuario-6')
    expect(itens).toEqual([])
  })

  it('buscarPorId encontra um item existente', async () => {
    const item = await itemDaEstanteService.buscarPorId('item-1')
    expect(item?.status).toBe('lido')
  })

  it('buscarPorUsuarioELivro encontra o item quando já está na estante', async () => {
    const item = await itemDaEstanteService.buscarPorUsuarioELivro('usuario-1', 'livro-1')
    expect(item?.id).toBe('item-1')
  })

  it('buscarPorUsuarioELivro retorna undefined quando o livro não está na estante do usuário', async () => {
    const item = await itemDaEstanteService.buscarPorUsuarioELivro('usuario-1', 'livro-12')
    expect(item).toBeUndefined()
  })

  it('criar adiciona o item com paginaAtual zerada e persiste', async () => {
    const novo = await itemDaEstanteService.criar({
      usuarioId: 'usuario-3',
      livroId: 'livro-4',
      status: 'quero-ler',
    })

    expect(novo.paginaAtual).toBe(0)

    const encontrado = await itemDaEstanteService.buscarPorId(novo.id)
    expect(encontrado?.livroId).toBe('livro-4')
  })

  it('criar rejeita livro já presente na estante do mesmo usuário', async () => {
    await expect(
      itemDaEstanteService.criar({
        usuarioId: 'usuario-1',
        livroId: 'livro-1',
        status: 'quero-ler',
      }),
    ).rejects.toThrow()
  })

  it('atualizar altera status/paginaAtual e persiste', async () => {
    const atualizado = await itemDaEstanteService.atualizar('item-4', {
      paginaAtual: 500,
    })
    expect(atualizado.paginaAtual).toBe(500)

    const encontrado = await itemDaEstanteService.buscarPorId('item-4')
    expect(encontrado?.paginaAtual).toBe(500)
  })

  it('atualizar rejeita id inexistente', async () => {
    await expect(
      itemDaEstanteService.atualizar('item-inexistente', { paginaAtual: 1 }),
    ).rejects.toThrow()
  })

  it('remover apaga o item', async () => {
    await itemDaEstanteService.remover('item-1')
    const encontrado = await itemDaEstanteService.buscarPorId('item-1')
    expect(encontrado).toBeUndefined()
  })

  it('remover rejeita id inexistente', async () => {
    await expect(itemDaEstanteService.remover('item-inexistente')).rejects.toThrow()
  })

  it('dado criado sobrevive a uma releitura simulando reload', async () => {
    await itemDaEstanteService.criar({
      usuarioId: 'usuario-6',
      livroId: 'livro-4',
      status: 'quero-ler',
    })
    const itens = await itemDaEstanteService.listarPorUsuario('usuario-6')
    expect(itens.length).toBe(1)
  })
})
