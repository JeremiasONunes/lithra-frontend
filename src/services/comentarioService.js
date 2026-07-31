import { delay, generateId, readCollection, writeCollection } from './mockStorage'
// `atividadesDoFeedFixture` importada de `atividadeDoFeedService.js` (não duplicada aqui) — este
// service também lê/escreve a coleção `atividadesDoFeed` (pra manter `comentarios` sincronizado
// com a quantidade real de comentários), então precisa da mesma fixture de semente que
// `atividadeDoFeedService` usa; mesmo padrão já usado em `avaliacaoService.js` (Etapa 7) com
// `livrosFixture`.
import { atividadesDoFeedFixture } from './atividadeDoFeedService'

const COLECAO = 'comentariosDoFeed'
const COLECAO_ATIVIDADES = 'atividadesDoFeed'

/**
 * @typedef {Object} Comentario
 * @property {string} id
 * @property {string} atividadeId
 * @property {string} usuarioId
 * @property {string} texto
 * @property {string} criadoEm - data ISO 8601
 */

/**
 * Fixture pequena, só pra demonstrar a lista de comentários já preenchida em pelo menos uma
 * atividade (`atividade-1`, cujo `comentarios: 2` em `atividadeDoFeedService.js` bate exatamente
 * com estes dois registros).
 * @type {Comentario[]}
 */
const comentariosFixture = [
  {
    id: 'comentario-1',
    atividadeId: 'atividade-1',
    usuarioId: 'usuario-2',
    texto: 'Também amei esse livro, a Terra Média é mágica.',
    criadoEm: '2025-04-01T11:00:00.000Z',
  },
  {
    id: 'comentario-2',
    atividadeId: 'atividade-1',
    usuarioId: 'usuario-3',
    texto: 'Preciso reler, faz tempo que não pego esse aqui.',
    criadoEm: '2025-04-01T14:30:00.000Z',
  },
]

function getAll() {
  return readCollection(COLECAO, comentariosFixture)
}

function getAllAtividades() {
  return readCollection(COLECAO_ATIVIDADES, atividadesDoFeedFixture)
}

/** Recalcula `comentarios` da atividade a partir dos comentários salvos — mesmo raciocínio de
 * `recalcularMediaDoLivro` em `avaliacaoService.js` (Etapa 7): a contagem nunca é editada direto,
 * só derivada do dado real toda vez que um comentário é criado. */
function sincronizarContadorDaAtividade(atividadeId, comentarios) {
  const atividades = getAllAtividades()
  const index = atividades.findIndex((atividade) => atividade.id === atividadeId)
  if (index === -1) {
    return
  }

  const total = comentarios.filter((comentario) => comentario.atividadeId === atividadeId).length
  const proximas = [...atividades]
  proximas[index] = { ...atividades[index], comentarios: total }
  writeCollection(COLECAO_ATIVIDADES, proximas)
}

/** Comentários de uma atividade, do mais antigo pro mais novo (ordem de conversa). */
async function listarPorAtividade(atividadeId) {
  await delay(300)
  return getAll()
    .filter((comentario) => comentario.atividadeId === atividadeId)
    .sort((a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime())
}

async function criar(dados) {
  await delay(400)
  const novo = {
    ...dados,
    id: generateId('comentario'),
    criadoEm: new Date().toISOString(),
  }

  const proximos = [...getAll(), novo]
  writeCollection(COLECAO, proximos)
  sincronizarContadorDaAtividade(dados.atividadeId, proximos)
  return novo
}

const comentarioService = {
  listarPorAtividade,
  criar,
}

export { comentarioService }
