import { MockServiceError, delay, generateId, readCollection, writeCollection } from './mockStorage'

const COLECAO = 'atividadesDoFeed'

/**
 * @typedef {'avaliacao' | 'progresso' | 'adicao-estante' | 'post-livre'} TipoAtividade
 */

/**
 * Formato por `tipo` (não há union discriminada formal em JS puro, então cada campo específico é
 * opcional aqui e só existe de fato conforme o `tipo` do registro):
 * @typedef {Object} AtividadeDoFeed
 * @property {string} id
 * @property {TipoAtividade} tipo
 * @property {string} usuarioId
 * @property {string} [livroId] - presente em 'avaliacao' | 'progresso' | 'adicao-estante'
 * @property {string} [avaliacaoId] - presente só em 'avaliacao'
 * @property {number} [paginaAtual] - presente só em 'progresso'
 * @property {number} [totalPaginas] - presente só em 'progresso'
 * @property {string} [texto] - presente só em 'post-livre'
 * @property {string} criadoEm - data ISO 8601
 * @property {number} curtidas
 * @property {string[]} curtidoPor - ids de quem já curtiu; garante 1 curtida por pessoa (não soma
 *   ao dado histórico da fixture, que já vem com `curtidas` seedado sem ator — só rastreia curtidas
 *   dadas de verdade pela UI, ver `curtir` abaixo)
 * @property {number} comentarios
 */

/**
 * Fixture determinística cobrindo os 4 tipos de atividade (avaliação, progresso, adição à estante,
 * post livre) — o Feed (Etapa 14) precisa renderizar um card por tipo desde o início.
 * @type {AtividadeDoFeed[]}
 */
const atividadesDoFeedFixture = [
  {
    id: 'atividade-1',
    tipo: 'avaliacao',
    usuarioId: 'usuario-1',
    livroId: 'livro-1',
    avaliacaoId: 'avaliacao-1',
    criadoEm: '2025-04-01T10:05:00.000Z',
    curtidas: 24,
    curtidoPor: [],
    comentarios: 8,
  },
  {
    id: 'atividade-2',
    tipo: 'progresso',
    usuarioId: 'usuario-1',
    livroId: 'livro-2',
    paginaAtual: 340,
    totalPaginas: 688,
    criadoEm: '2025-06-10T10:00:00.000Z',
    curtidas: 5,
    curtidoPor: [],
    comentarios: 0,
  },
  {
    id: 'atividade-3',
    tipo: 'progresso',
    usuarioId: 'usuario-4',
    livroId: 'livro-7',
    paginaAtual: 150,
    totalPaginas: 416,
    criadoEm: '2025-06-12T10:00:00.000Z',
    curtidas: 2,
    curtidoPor: [],
    comentarios: 1,
  },
  {
    id: 'atividade-4',
    tipo: 'adicao-estante',
    usuarioId: 'usuario-2',
    livroId: 'livro-4',
    criadoEm: '2025-06-20T10:05:00.000Z',
    curtidas: 3,
    curtidoPor: [],
    comentarios: 0,
  },
  {
    id: 'atividade-5',
    tipo: 'adicao-estante',
    usuarioId: 'usuario-3',
    livroId: 'livro-12',
    criadoEm: '2025-06-18T10:05:00.000Z',
    curtidas: 1,
    curtidoPor: [],
    comentarios: 0,
  },
  {
    id: 'atividade-6',
    tipo: 'avaliacao',
    usuarioId: 'usuario-2',
    livroId: 'livro-2',
    avaliacaoId: 'avaliacao-3',
    criadoEm: '2025-03-20T09:05:00.000Z',
    curtidas: 18,
    curtidoPor: [],
    comentarios: 4,
  },
  {
    id: 'atividade-7',
    tipo: 'avaliacao',
    usuarioId: 'usuario-3',
    livroId: 'livro-3',
    avaliacaoId: 'avaliacao-4',
    criadoEm: '2025-02-10T11:35:00.000Z',
    curtidas: 12,
    curtidoPor: [],
    comentarios: 3,
  },
  {
    id: 'atividade-8',
    tipo: 'post-livre',
    usuarioId: 'usuario-1',
    texto: 'Alguém mais lendo algo bom essa semana? Preciso de uma indicação nova!',
    criadoEm: '2025-06-22T08:00:00.000Z',
    curtidas: 7,
    curtidoPor: [],
    comentarios: 5,
  },
  {
    id: 'atividade-9',
    tipo: 'post-livre',
    usuarioId: 'usuario-4',
    texto: 'Terminei mais um capítulo de Circe hoje. Que livro incrível.',
    criadoEm: '2025-06-21T21:00:00.000Z',
    curtidas: 9,
    curtidoPor: [],
    comentarios: 2,
  },
  {
    id: 'atividade-10',
    tipo: 'avaliacao',
    usuarioId: 'usuario-3',
    livroId: 'livro-8',
    avaliacaoId: 'avaliacao-12',
    criadoEm: '2025-01-15T10:05:00.000Z',
    curtidas: 30,
    curtidoPor: [],
    comentarios: 6,
  },
]

function getAll() {
  return readCollection(COLECAO, atividadesDoFeedFixture)
}

function ordenarPorMaisRecente(atividades) {
  return [...atividades].sort(
    (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
  )
}

/** Todas as atividades, da mais recente para a mais antiga. Filtrar por "quem o usuário segue" é
 * lógica de produto do Feed (Etapa 14), que compõe isto com `seguimentoService` — não é
 * responsabilidade da camada de dados. */
async function listar() {
  await delay(300)
  return ordenarPorMaisRecente(getAll())
}

async function listarPorUsuario(usuarioId) {
  await delay(300)
  return ordenarPorMaisRecente(getAll().filter((atividade) => atividade.usuarioId === usuarioId))
}

async function buscarPorId(id) {
  await delay(200)
  return getAll().find((atividade) => atividade.id === id)
}

/** Cria uma atividade de qualquer um dos 4 tipos — usado tanto pelo composer de texto livre
 * (Etapa 14) quanto, futuramente, por outros serviços que quiserem publicar um evento no feed. */
async function criar(dados) {
  await delay(400)
  const nova = {
    ...dados,
    id: generateId('atividade'),
    criadoEm: new Date().toISOString(),
    curtidas: 0,
    curtidoPor: [],
    comentarios: 0,
  }

  writeCollection(COLECAO, [...getAll(), nova])
  return nova
}

/** Alterna a curtida de `usuarioId` (curtir se ainda não tinha curtido, descurtir se já tinha) —
 * cada pessoa só pode ter uma curtida ativa por vez numa atividade, nunca mais de uma. `curtidoPor`
 * pode não existir em registros salvos antes desse campo existir (localStorage antigo); `?? []`
 * trata isso como "ninguém curtiu ainda" em vez de quebrar. */
async function curtir(id, usuarioId) {
  await delay(200)
  const atividades = getAll()
  const index = atividades.findIndex((atividade) => atividade.id === id)

  if (index === -1) {
    throw new MockServiceError('Atividade não encontrada.')
  }

  const atividade = atividades[index]
  const curtidoPor = atividade.curtidoPor ?? []
  const jaCurtiu = curtidoPor.includes(usuarioId)

  const atualizada = {
    ...atividade,
    curtidas: jaCurtiu ? atividade.curtidas - 1 : atividade.curtidas + 1,
    curtidoPor: jaCurtiu
      ? curtidoPor.filter((idUsuario) => idUsuario !== usuarioId)
      : [...curtidoPor, usuarioId],
  }
  const proximas = [...atividades]
  proximas[index] = atualizada
  writeCollection(COLECAO, proximas)
  return atualizada
}

/** Incrementa `comentarios` em 1 — mesmo raciocínio de `curtir`: a entidade não guarda o conteúdo
 * de cada comentário, só o total (Etapa 14 não pede uma tela de lista/thread de comentários). */
async function comentar(id) {
  await delay(200)
  const atividades = getAll()
  const index = atividades.findIndex((atividade) => atividade.id === id)

  if (index === -1) {
    throw new MockServiceError('Atividade não encontrada.')
  }

  const atualizada = { ...atividades[index], comentarios: atividades[index].comentarios + 1 }
  const proximas = [...atividades]
  proximas[index] = atualizada
  writeCollection(COLECAO, proximas)
  return atualizada
}

const atividadeDoFeedService = {
  listar,
  listarPorUsuario,
  buscarPorId,
  criar,
  curtir,
  comentar,
}

export { atividadeDoFeedService }
