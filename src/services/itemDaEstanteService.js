import { MockServiceError, delay, generateId, readCollection, writeCollection } from './mockStorage'

const COLECAO = 'itensDaEstante'

/**
 * @typedef {'quero-ler' | 'lendo' | 'lido'} StatusLeitura
 */

/**
 * @typedef {Object} ItemDaEstante
 * @property {string} id
 * @property {string} usuarioId
 * @property {string} livroId
 * @property {StatusLeitura} status
 * @property {number} paginaAtual - só é significativo quando `status === 'lendo'`; fica em 0 pra
 *   "quero ler" e igual ao total de páginas do livro quando "lido" (a cargo de quem chama
 *   `atualizar`, não validado aqui)
 * @property {string} adicionadoEm - data ISO 8601
 * @property {string} atualizadoEm - data ISO 8601
 */

/**
 * Fixture determinística — mistura de status por usuário, incluindo um livro "lendo" com progresso
 * parcial (pra `ReadingProgressBar`, Etapa 6) e itens "quero ler" sem progresso. `usuario-5` (conta
 * desativada) e `usuario-6` (administrador) de propósito não têm nenhum item, pra testar o estado
 * vazio da estante.
 * @type {ItemDaEstante[]}
 */
const itensDaEstanteFixture = [
  {
    id: 'item-1',
    usuarioId: 'usuario-1',
    livroId: 'livro-1',
    status: 'lido',
    paginaAtual: 310,
    adicionadoEm: '2025-03-25T10:00:00.000Z',
    atualizadoEm: '2025-04-01T10:00:00.000Z',
  },
  {
    id: 'item-2',
    usuarioId: 'usuario-1',
    livroId: 'livro-5',
    status: 'lido',
    paginaAtual: 400,
    adicionadoEm: '2025-04-25T10:00:00.000Z',
    atualizadoEm: '2025-05-01T16:00:00.000Z',
  },
  {
    id: 'item-3',
    usuarioId: 'usuario-1',
    livroId: 'livro-6',
    status: 'lido',
    paginaAtual: 288,
    adicionadoEm: '2025-04-15T10:00:00.000Z',
    atualizadoEm: '2025-04-22T19:00:00.000Z',
  },
  {
    id: 'item-4',
    usuarioId: 'usuario-1',
    livroId: 'livro-2',
    status: 'lendo',
    paginaAtual: 340,
    adicionadoEm: '2025-06-01T10:00:00.000Z',
    atualizadoEm: '2025-06-10T10:00:00.000Z',
  },
  {
    id: 'item-5',
    usuarioId: 'usuario-1',
    livroId: 'livro-9',
    status: 'quero-ler',
    paginaAtual: 0,
    adicionadoEm: '2025-06-15T10:00:00.000Z',
    atualizadoEm: '2025-06-15T10:00:00.000Z',
  },
  {
    id: 'item-6',
    usuarioId: 'usuario-2',
    livroId: 'livro-1',
    status: 'lido',
    paginaAtual: 310,
    adicionadoEm: '2025-03-28T10:00:00.000Z',
    atualizadoEm: '2025-04-03T14:00:00.000Z',
  },
  {
    id: 'item-7',
    usuarioId: 'usuario-2',
    livroId: 'livro-2',
    status: 'lido',
    paginaAtual: 688,
    adicionadoEm: '2025-03-10T10:00:00.000Z',
    atualizadoEm: '2025-03-20T09:00:00.000Z',
  },
  {
    id: 'item-8',
    usuarioId: 'usuario-2',
    livroId: 'livro-7',
    status: 'lido',
    paginaAtual: 416,
    adicionadoEm: '2025-02-25T10:00:00.000Z',
    atualizadoEm: '2025-03-08T21:00:00.000Z',
  },
  {
    id: 'item-9',
    usuarioId: 'usuario-2',
    livroId: 'livro-11',
    status: 'lido',
    paginaAtual: 328,
    adicionadoEm: '2025-01-20T10:00:00.000Z',
    atualizadoEm: '2025-01-30T09:00:00.000Z',
  },
  {
    id: 'item-10',
    usuarioId: 'usuario-2',
    livroId: 'livro-4',
    status: 'quero-ler',
    paginaAtual: 0,
    adicionadoEm: '2025-06-20T10:00:00.000Z',
    atualizadoEm: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'item-11',
    usuarioId: 'usuario-3',
    livroId: 'livro-3',
    status: 'lido',
    paginaAtual: 256,
    adicionadoEm: '2025-02-01T10:00:00.000Z',
    atualizadoEm: '2025-02-10T11:30:00.000Z',
  },
  {
    id: 'item-12',
    usuarioId: 'usuario-3',
    livroId: 'livro-8',
    status: 'lido',
    paginaAtual: 464,
    adicionadoEm: '2025-01-05T10:00:00.000Z',
    atualizadoEm: '2025-01-15T10:00:00.000Z',
  },
  {
    id: 'item-13',
    usuarioId: 'usuario-3',
    livroId: 'livro-10',
    status: 'lido',
    paginaAtual: 280,
    adicionadoEm: '2025-02-15T10:00:00.000Z',
    atualizadoEm: '2025-02-25T12:00:00.000Z',
  },
  {
    id: 'item-14',
    usuarioId: 'usuario-3',
    livroId: 'livro-12',
    status: 'quero-ler',
    paginaAtual: 0,
    adicionadoEm: '2025-06-18T10:00:00.000Z',
    atualizadoEm: '2025-06-18T10:00:00.000Z',
  },
  {
    id: 'item-15',
    usuarioId: 'usuario-4',
    livroId: 'livro-5',
    status: 'lido',
    paginaAtual: 400,
    adicionadoEm: '2025-04-28T10:00:00.000Z',
    atualizadoEm: '2025-05-05T20:00:00.000Z',
  },
  {
    id: 'item-16',
    usuarioId: 'usuario-4',
    livroId: 'livro-6',
    status: 'lido',
    paginaAtual: 288,
    adicionadoEm: '2025-04-12T10:00:00.000Z',
    atualizadoEm: '2025-04-20T13:00:00.000Z',
  },
  {
    id: 'item-17',
    usuarioId: 'usuario-4',
    livroId: 'livro-7',
    status: 'lendo',
    paginaAtual: 150,
    adicionadoEm: '2025-06-05T10:00:00.000Z',
    atualizadoEm: '2025-06-12T10:00:00.000Z',
  },
]

function getAll() {
  return readCollection(COLECAO, itensDaEstanteFixture)
}

async function listarPorUsuario(usuarioId, status) {
  await delay(300)
  return getAll().filter(
    (item) => item.usuarioId === usuarioId && (status === undefined || item.status === status),
  )
}

async function buscarPorId(id) {
  await delay(200)
  return getAll().find((item) => item.id === id)
}

/** Usado pela Página do Livro (Etapa 12) pra decidir se mostra "Adicionar à Estante" ou o estado
 * já adicionado. */
async function buscarPorUsuarioELivro(usuarioId, livroId) {
  await delay(200)
  return getAll().find((item) => item.usuarioId === usuarioId && item.livroId === livroId)
}

/** Todos os itens de estante que referenciam um livro, de qualquer usuário — espelha
 * `avaliacaoService.listarPorLivro` (Etapa 12). Usado por `useMesclarLivros` (Etapa 19) pra
 * reatribuir os itens do livro duplicado pro livro principal antes de remover o duplicado, sem
 * deixar `livroId` órfão apontando pra um registro que não existe mais. */
async function listarPorLivro(livroId) {
  await delay(300)
  return getAll().filter((item) => item.livroId === livroId)
}

async function criar(dados) {
  await delay(400)
  const itens = getAll()

  if (itens.some((item) => item.usuarioId === dados.usuarioId && item.livroId === dados.livroId)) {
    throw new MockServiceError('Este livro já está na estante deste usuário.')
  }

  const agora = new Date().toISOString()
  const novoItem = {
    ...dados,
    id: generateId('item'),
    paginaAtual: 0,
    adicionadoEm: agora,
    atualizadoEm: agora,
  }

  writeCollection(COLECAO, [...itens, novoItem])
  return novoItem
}

async function atualizar(id, dados) {
  await delay(300)
  const itens = getAll()
  const index = itens.findIndex((item) => item.id === id)

  if (index === -1) {
    throw new MockServiceError('Item da estante não encontrado.')
  }

  const atualizado = {
    ...itens[index],
    ...dados,
    atualizadoEm: new Date().toISOString(),
  }
  const proximos = [...itens]
  proximos[index] = atualizado
  writeCollection(COLECAO, proximos)
  return atualizado
}

async function remover(id) {
  await delay(300)
  const itens = getAll()

  if (!itens.some((item) => item.id === id)) {
    throw new MockServiceError('Item da estante não encontrado.')
  }

  writeCollection(
    COLECAO,
    itens.filter((item) => item.id !== id),
  )
}

const itemDaEstanteService = {
  listarPorUsuario,
  buscarPorId,
  buscarPorUsuarioELivro,
  listarPorLivro,
  criar,
  atualizar,
  remover,
}

export { itemDaEstanteService }
