import { MockServiceError, delay, generateId, readCollection, writeCollection } from './mockStorage'
// `livrosFixture` importada de `livroService.js` (não duplicada aqui) — este service também lê/
// escreve a coleção `livros` (pra recalcular a média), então precisa da mesma fixture de semente
// que `livroService` usa, senão a primeira leitura de cada um semearia dados diferentes.
import { livrosFixture } from './livroService'

const COLECAO = 'avaliacoes'
const COLECAO_LIVROS = 'livros'

/**
 * @typedef {Object} Avaliacao
 * @property {string} id
 * @property {string} usuarioId
 * @property {string} livroId
 * @property {number} nota - de 1 a 5
 * @property {string} resenha
 * @property {string} criadoEm - data ISO 8601
 * @property {string} atualizadoEm - data ISO 8601
 */

/**
 * Fixture determinística. As notas somam exatamente `mediaAvaliacoes`/`totalAvaliacoes` de
 * `livroService` para cada `livroId` — se uma mudar, a outra precisa ser conferida também (em tempo
 * de execução, `recalcularMediaDoLivro` mantém isso sincronizado automaticamente).
 * @type {Avaliacao[]}
 */
const avaliacoesFixture = [
  {
    id: 'avaliacao-1',
    usuarioId: 'usuario-1',
    livroId: 'livro-1',
    nota: 5,
    resenha:
      'Simplesmente mágico. A jornada de Bilbo é inspiradora e a escrita de Tolkien é como um abraço quente.',
    criadoEm: '2025-04-01T10:00:00.000Z',
    atualizadoEm: '2025-04-01T10:00:00.000Z',
  },
  {
    id: 'avaliacao-2',
    usuarioId: 'usuario-2',
    livroId: 'livro-1',
    nota: 4,
    resenha: 'Muito bom, mas um pouco arrastado no meio.',
    criadoEm: '2025-04-03T14:00:00.000Z',
    atualizadoEm: '2025-04-03T14:00:00.000Z',
  },
  {
    id: 'avaliacao-3',
    usuarioId: 'usuario-2',
    livroId: 'livro-2',
    nota: 5,
    resenha: 'Obra-prima da ficção científica. Cada releitura revela algo novo.',
    criadoEm: '2025-03-20T09:00:00.000Z',
    atualizadoEm: '2025-03-20T09:00:00.000Z',
  },
  {
    id: 'avaliacao-4',
    usuarioId: 'usuario-3',
    livroId: 'livro-3',
    nota: 4,
    resenha: 'Bentinho é um narrador e tanto — nunca se sabe se acreditar nele.',
    criadoEm: '2025-02-10T11:30:00.000Z',
    atualizadoEm: '2025-02-10T11:30:00.000Z',
  },
  {
    id: 'avaliacao-5',
    usuarioId: 'usuario-1',
    livroId: 'livro-5',
    nota: 5,
    resenha: 'Circe é uma personagem inesquecível, cheia de força e vulnerabilidade.',
    criadoEm: '2025-05-01T16:00:00.000Z',
    atualizadoEm: '2025-05-01T16:00:00.000Z',
  },
  {
    id: 'avaliacao-6',
    usuarioId: 'usuario-4',
    livroId: 'livro-5',
    nota: 5,
    resenha: 'Reli em uma semana, não conseguia parar.',
    criadoEm: '2025-05-05T20:00:00.000Z',
    atualizadoEm: '2025-05-05T20:00:00.000Z',
  },
  {
    id: 'avaliacao-7',
    usuarioId: 'usuario-2',
    livroId: 'livro-5',
    nota: 4,
    resenha: 'Ritmo um pouco lento no início, mas vale muito a pena.',
    criadoEm: '2025-05-10T08:00:00.000Z',
    atualizadoEm: '2025-05-10T08:00:00.000Z',
  },
  {
    id: 'avaliacao-8',
    usuarioId: 'usuario-3',
    livroId: 'livro-6',
    nota: 4,
    resenha: 'Uma reflexão bonita sobre escolhas e arrependimento.',
    criadoEm: '2025-04-20T13:00:00.000Z',
    atualizadoEm: '2025-04-20T13:00:00.000Z',
  },
  {
    id: 'avaliacao-9',
    usuarioId: 'usuario-1',
    livroId: 'livro-6',
    nota: 5,
    resenha: 'Chorei no final, em boa parte.',
    criadoEm: '2025-04-22T19:00:00.000Z',
    atualizadoEm: '2025-04-22T19:00:00.000Z',
  },
  {
    id: 'avaliacao-10',
    usuarioId: 'usuario-4',
    livroId: 'livro-7',
    nota: 3,
    resenha: 'Personagens difíceis de gostar, mas a atmosfera é única.',
    criadoEm: '2025-03-05T17:00:00.000Z',
    atualizadoEm: '2025-03-05T17:00:00.000Z',
  },
  {
    id: 'avaliacao-11',
    usuarioId: 'usuario-2',
    livroId: 'livro-7',
    nota: 4,
    resenha: 'Sombrio e intenso, exatamente como esperava.',
    criadoEm: '2025-03-08T21:00:00.000Z',
    atualizadoEm: '2025-03-08T21:00:00.000Z',
  },
  {
    id: 'avaliacao-12',
    usuarioId: 'usuario-3',
    livroId: 'livro-8',
    nota: 5,
    resenha: 'Muda a forma como você pensa sobre a história da humanidade.',
    criadoEm: '2025-01-15T10:00:00.000Z',
    atualizadoEm: '2025-01-15T10:00:00.000Z',
  },
  {
    id: 'avaliacao-13',
    usuarioId: 'usuario-1',
    livroId: 'livro-10',
    nota: 4,
    resenha: 'Jorge Amado retrata a infância roubada com muita sensibilidade.',
    criadoEm: '2025-02-25T12:00:00.000Z',
    atualizadoEm: '2025-02-25T12:00:00.000Z',
  },
  {
    id: 'avaliacao-14',
    usuarioId: 'usuario-2',
    livroId: 'livro-11',
    nota: 5,
    resenha: 'Assustadoramente atual.',
    criadoEm: '2025-01-30T09:00:00.000Z',
    atualizadoEm: '2025-01-30T09:00:00.000Z',
  },
  {
    id: 'avaliacao-15',
    usuarioId: 'usuario-4',
    livroId: 'livro-11',
    nota: 4,
    resenha: 'Denso, mas essencial.',
    criadoEm: '2025-02-02T15:00:00.000Z',
    atualizadoEm: '2025-02-02T15:00:00.000Z',
  },
]

function getAll() {
  return readCollection(COLECAO, avaliacoesFixture)
}

function getAllLivros() {
  return readCollection(COLECAO_LIVROS, livrosFixture)
}

/** Recalcula `mediaAvaliacoes`/`totalAvaliacoes` do livro a partir de todas as avaliações
 * atualmente salvas — chamado sempre que uma avaliação é criada, editada ou removida, nunca
 * deixado para o chamador manter isso sincronizado manualmente. */
function recalcularMediaDoLivro(livroId, avaliacoes) {
  const livros = getAllLivros()
  const index = livros.findIndex((livro) => livro.id === livroId)
  if (index === -1) {
    return
  }

  const notasDoLivro = avaliacoes.filter((avaliacao) => avaliacao.livroId === livroId)
  const totalAvaliacoes = notasDoLivro.length
  const mediaAvaliacoes =
    totalAvaliacoes === 0
      ? 0
      : Math.round(
          (notasDoLivro.reduce((soma, item) => soma + item.nota, 0) / totalAvaliacoes) * 10,
        ) / 10

  const proximos = [...livros]
  proximos[index] = { ...livros[index], mediaAvaliacoes, totalAvaliacoes }
  writeCollection(COLECAO_LIVROS, proximos)
}

async function listarPorLivro(livroId) {
  await delay(300)
  return getAll().filter((avaliacao) => avaliacao.livroId === livroId)
}

async function listarPorUsuario(usuarioId) {
  await delay(300)
  return getAll().filter((avaliacao) => avaliacao.usuarioId === usuarioId)
}

async function buscarPorId(id) {
  await delay(200)
  return getAll().find((avaliacao) => avaliacao.id === id)
}

async function criar(dados) {
  await delay(400)
  const agora = new Date().toISOString()
  const nova = {
    ...dados,
    id: generateId('avaliacao'),
    criadoEm: agora,
    atualizadoEm: agora,
  }

  const proximas = [...getAll(), nova]
  writeCollection(COLECAO, proximas)
  recalcularMediaDoLivro(dados.livroId, proximas)
  return nova
}

async function atualizar(id, dados) {
  await delay(300)
  const avaliacoes = getAll()
  const index = avaliacoes.findIndex((avaliacao) => avaliacao.id === id)

  if (index === -1) {
    throw new MockServiceError('Avaliação não encontrada.')
  }

  const atualizada = {
    ...avaliacoes[index],
    ...dados,
    atualizadoEm: new Date().toISOString(),
  }
  const proximas = [...avaliacoes]
  proximas[index] = atualizada
  writeCollection(COLECAO, proximas)
  recalcularMediaDoLivro(atualizada.livroId, proximas)
  return atualizada
}

async function remover(id) {
  await delay(300)
  const avaliacoes = getAll()
  const existente = avaliacoes.find((avaliacao) => avaliacao.id === id)

  if (!existente) {
    throw new MockServiceError('Avaliação não encontrada.')
  }

  const proximas = avaliacoes.filter((avaliacao) => avaliacao.id !== id)
  writeCollection(COLECAO, proximas)
  recalcularMediaDoLivro(existente.livroId, proximas)
}

const avaliacaoService = {
  listarPorLivro,
  listarPorUsuario,
  buscarPorId,
  criar,
  atualizar,
  remover,
}

export { avaliacaoService }
