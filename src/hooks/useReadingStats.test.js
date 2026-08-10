import { describe, expect, it } from 'vitest'

import { agregarEstatisticasDeLeitura, contarLivrosLidosNoAno } from './useReadingStats'

const LIVRO_HOBBIT = { id: 'livro-1', autor: 'Tolkien', genero: 'Fantasia', numeroPaginas: 310 }
const LIVRO_CIRCE = {
  id: 'livro-2',
  autor: 'Madeline Miller',
  genero: 'Fantasia',
  numeroPaginas: 400,
}
const LIVRO_DUNA = {
  id: 'livro-3',
  autor: 'Frank Herbert',
  genero: 'Ficção Científica',
  numeroPaginas: 688,
}
const LIVROS = [LIVRO_HOBBIT, LIVRO_CIRCE, LIVRO_DUNA]

function item(id, livroId, status, atualizadoEm) {
  return { id, livroId, status, atualizadoEm }
}

function avaliacao(livroId, nota) {
  return { livroId, nota }
}

/** Livro como aparece dentro de `distribucaoPorGenero[].livros` — sempre com `minhaNota` (`null`
 * quando o usuário não avaliou aquele livro). */
function comNota(livro, nota = null) {
  return { ...livro, minhaNota: nota }
}

describe('agregarEstatisticasDeLeitura', () => {
  it('estante vazia: todos os totais zerados, sem gênero/autor favorito, sem erro', () => {
    const resultado = agregarEstatisticasDeLeitura([], LIVROS)

    expect(resultado.totalLivrosLidos).toBe(0)
    expect(resultado.totalPaginasLidas).toBe(0)
    expect(resultado.distribucaoPorGenero).toEqual([])
    expect(resultado.generoFavorito).toBeNull()
    expect(resultado.autorMaisLido).toBeNull()
    expect(resultado.livrosPorMes).toHaveLength(12)
    expect(resultado.livrosPorMes.every((mes) => mes.quantidade === 0)).toBe(true)
    // Sem nenhum livro lido, cai no ano real corrente (não há dado nenhum pra derivar de outro jeito).
    expect(resultado.anoReferencia).toBe(new Date().getFullYear())
    expect(resultado.livrosLidosNoAnoReferencia).toBe(0)
  })

  it('itens "quero-ler"/"lendo" não contam pras estatísticas — só "lido"', () => {
    const itens = [
      item('item-1', 'livro-1', 'quero-ler', '2025-01-10T10:00:00.000Z'),
      item('item-2', 'livro-2', 'lendo', '2025-02-10T10:00:00.000Z'),
    ]
    const resultado = agregarEstatisticasDeLeitura(itens, LIVROS)

    expect(resultado.totalLivrosLidos).toBe(0)
    expect(resultado.totalPaginasLidas).toBe(0)
  })

  it('um único gênero: gênero favorito é o único presente, distribuição com 1 entrada', () => {
    const itens = [
      item('item-1', 'livro-1', 'lido', '2025-03-01T10:00:00.000Z'),
      item('item-2', 'livro-2', 'lido', '2025-04-01T10:00:00.000Z'),
    ]
    const resultado = agregarEstatisticasDeLeitura(itens, LIVROS)

    expect(resultado.totalLivrosLidos).toBe(2)
    expect(resultado.generoFavorito).toBe('Fantasia')
    expect(resultado.distribucaoPorGenero).toEqual([
      { genero: 'Fantasia', quantidade: 2, livros: [comNota(LIVRO_HOBBIT), comNota(LIVRO_CIRCE)] },
    ])
  })

  it('agrega páginas, gênero/autor favorito e livros por mês de um histórico com vários gêneros', () => {
    const itens = [
      item('item-1', 'livro-1', 'lido', '2025-03-15T10:00:00.000Z'), // Fantasia, Mar
      item('item-2', 'livro-2', 'lido', '2025-03-20T10:00:00.000Z'), // Fantasia, Mar
      item('item-3', 'livro-3', 'lido', '2025-05-01T10:00:00.000Z'), // Ficção Científica, Mai
      item('item-4', 'livro-3', 'quero-ler', '2025-06-01T10:00:00.000Z'), // ignorado (não é "lido")
    ]
    const resultado = agregarEstatisticasDeLeitura(itens, LIVROS)

    expect(resultado.totalLivrosLidos).toBe(3)
    expect(resultado.totalPaginasLidas).toBe(310 + 400 + 688)
    expect(resultado.generoFavorito).toBe('Fantasia')
    expect(resultado.distribucaoPorGenero).toEqual([
      { genero: 'Fantasia', quantidade: 2, livros: [comNota(LIVRO_HOBBIT), comNota(LIVRO_CIRCE)] },
      { genero: 'Ficção Científica', quantidade: 1, livros: [comNota(LIVRO_DUNA)] },
    ])
    expect(resultado.autorMaisLido).toBe('Tolkien')
    expect(resultado.livrosPorMes.find((mes) => mes.mes === 'Mar').quantidade).toBe(2)
    expect(resultado.livrosPorMes.find((mes) => mes.mes === 'Mai').quantidade).toBe(1)
    expect(resultado.livrosPorMes.find((mes) => mes.mes === 'Jan').quantidade).toBe(0)
    expect(resultado.anoReferencia).toBe(2025)
    expect(resultado.livrosLidosNoAnoReferencia).toBe(3)
  })

  it('cada entrada de distribucaoPorGenero traz os livros de verdade daquele gênero, não só a contagem', () => {
    const itens = [
      item('item-1', 'livro-1', 'lido', '2025-03-15T10:00:00.000Z'),
      item('item-2', 'livro-3', 'lido', '2025-05-01T10:00:00.000Z'),
    ]
    const resultado = agregarEstatisticasDeLeitura(itens, LIVROS)

    const fantasia = resultado.distribucaoPorGenero.find((linha) => linha.genero === 'Fantasia')
    expect(fantasia.livros).toEqual([comNota(LIVRO_HOBBIT)])

    const ficcaoCientifica = resultado.distribucaoPorGenero.find(
      (linha) => linha.genero === 'Ficção Científica',
    )
    expect(ficcaoCientifica.livros).toEqual([comNota(LIVRO_DUNA)])
  })

  it('anexa "minha avaliação" (minhaNota) em cada livro de distribucaoPorGenero, null quando não avaliado', () => {
    const itens = [
      item('item-1', 'livro-1', 'lido', '2025-03-15T10:00:00.000Z'),
      item('item-2', 'livro-2', 'lido', '2025-03-20T10:00:00.000Z'),
    ]
    const avaliacoes = [avaliacao('livro-1', 5)] // só O Hobbit foi avaliado, Circe não
    const resultado = agregarEstatisticasDeLeitura(itens, LIVROS, avaliacoes)

    const fantasia = resultado.distribucaoPorGenero.find((linha) => linha.genero === 'Fantasia')
    const hobbit = fantasia.livros.find((livro) => livro.id === 'livro-1')
    const circe = fantasia.livros.find((livro) => livro.id === 'livro-2')

    expect(hobbit.minhaNota).toBe(5)
    expect(circe.minhaNota).toBeNull()
  })

  it('anoReferencia é o ano mais recente com livro lido, mesmo com histórico em vários anos', () => {
    const itens = [
      item('item-1', 'livro-1', 'lido', '2024-01-10T10:00:00.000Z'),
      item('item-2', 'livro-2', 'lido', '2025-06-10T10:00:00.000Z'),
    ]
    const resultado = agregarEstatisticasDeLeitura(itens, LIVROS)

    expect(resultado.anoReferencia).toBe(2025)
    // Livros lidos no ano de referência (2025) conta só o item de 2025, não o de 2024.
    expect(resultado.livrosLidosNoAnoReferencia).toBe(1)
    // Mas o total geral (todo o histórico) continua contando os dois.
    expect(resultado.totalLivrosLidos).toBe(2)
  })
})

describe('contarLivrosLidosNoAno', () => {
  it('nenhum livro lido no ano pedido', () => {
    const itens = [item('item-1', 'livro-1', 'lido', '2024-01-10T10:00:00.000Z')]
    expect(contarLivrosLidosNoAno(itens, 2025)).toBe(0)
  })

  it('meta já atingida: contagem do ano é maior ou igual à meta definida', () => {
    const itens = [
      item('item-1', 'livro-1', 'lido', '2025-01-10T10:00:00.000Z'),
      item('item-2', 'livro-2', 'lido', '2025-02-10T10:00:00.000Z'),
      item('item-3', 'livro-3', 'lido', '2025-03-10T10:00:00.000Z'),
    ]
    const metaLivros = 2
    const lidosNoAno = contarLivrosLidosNoAno(itens, 2025)

    expect(lidosNoAno).toBe(3)
    expect(lidosNoAno).toBeGreaterThanOrEqual(metaLivros)
  })
})
