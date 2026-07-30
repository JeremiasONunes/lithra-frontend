import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { livroService } from './livroService'
import { resetMockData } from './mockStorage'

describe('livroService', () => {
  beforeEach(() => {
    resetMockData()
  })

  afterEach(() => {
    resetMockData()
  })

  it('listar retorna a fixture semeada no localStorage', async () => {
    const livros = await livroService.listar()
    expect(livros.length).toBeGreaterThan(0)
    expect(livros[0]).toHaveProperty('titulo')
  })

  it('buscarPorId encontra um livro existente', async () => {
    const livro = await livroService.buscarPorId('livro-1')
    expect(livro?.titulo).toBe('O Hobbit')
  })

  it('buscarPorId retorna undefined para id inexistente', async () => {
    const livro = await livroService.buscarPorId('livro-inexistente')
    expect(livro).toBeUndefined()
  })

  it('buscarPorTitulo encontra por trecho do título, case-insensitive', async () => {
    const resultado = await livroService.buscarPorTitulo('hobbit')
    expect(resultado.some((livro) => livro.id === 'livro-1')).toBe(true)
  })

  it('buscarPorTitulo encontra por autor', async () => {
    const resultado = await livroService.buscarPorTitulo('Tolkien')
    expect(resultado.some((livro) => livro.id === 'livro-1')).toBe(true)
  })

  it('buscarPorTitulo retorna o catálogo inteiro pra termo em branco, sem lançar erro', async () => {
    const resultado = await livroService.buscarPorTitulo('   ')
    const todos = await livroService.listar()
    expect(resultado).toEqual(todos)
  })

  it('buscarPorTitulo retorna lista vazia quando nenhum livro corresponde ao termo', async () => {
    const resultado = await livroService.buscarPorTitulo('termo-que-nao-existe-em-nenhum-livro')
    expect(resultado).toEqual([])
  })

  it('criar adiciona um novo livro já com médias zeradas e persiste', async () => {
    const novo = await livroService.criar({
      titulo: 'Livro Novo',
      autor: 'Autor Novo',
      genero: 'Ficção',
      sinopse: 'Sinopse de teste.',
      numeroPaginas: 100,
      ano: 2024,
    })

    expect(novo.id).toBeTruthy()
    expect(novo.mediaAvaliacoes).toBe(0)
    expect(novo.totalAvaliacoes).toBe(0)

    const encontrado = await livroService.buscarPorId(novo.id)
    expect(encontrado?.titulo).toBe('Livro Novo')
  })

  it('atualizar altera os campos informados e persiste', async () => {
    const atualizado = await livroService.atualizar('livro-1', { sinopse: 'Nova sinopse.' })
    expect(atualizado.sinopse).toBe('Nova sinopse.')

    const encontrado = await livroService.buscarPorId('livro-1')
    expect(encontrado?.sinopse).toBe('Nova sinopse.')
  })

  it('atualizar rejeita id inexistente', async () => {
    await expect(livroService.atualizar('livro-inexistente', { titulo: 'x' })).rejects.toThrow()
  })

  it('dado criado sobrevive a uma releitura simulando reload', async () => {
    await livroService.criar({
      titulo: 'Persistente',
      autor: 'Autor',
      genero: 'Ficção',
      sinopse: 's',
      numeroPaginas: 1,
      ano: 2024,
    })
    const livros = await livroService.listar()
    expect(livros.some((livro) => livro.titulo === 'Persistente')).toBe(true)
  })
})
