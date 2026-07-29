import { MockServiceError, delay, generateId, readCollection, writeCollection } from './mockStorage'

const COLECAO = 'seguimentos'

/**
 * @typedef {Object} Seguimento
 * @property {string} id
 * @property {string} seguidorId - quem segue
 * @property {string} seguidoId - quem é seguido
 * @property {string} criadoEm - data ISO 8601
 */

/**
 * Fixture determinística — pequeno grafo social entre `usuario-1..4`. Inclui de propósito um caso
 * de borda: `usuario-1` segue `usuario-5` (conta desativada), pra testar como a UI (Etapa 16) lida
 * com seguir alguém que não está mais ativo.
 * @type {Seguimento[]}
 */
const seguimentosFixture = [
  {
    id: 'seguimento-1',
    seguidorId: 'usuario-1',
    seguidoId: 'usuario-2',
    criadoEm: '2025-01-15T10:00:00.000Z',
  },
  {
    id: 'seguimento-2',
    seguidorId: 'usuario-1',
    seguidoId: 'usuario-3',
    criadoEm: '2025-01-16T10:00:00.000Z',
  },
  {
    id: 'seguimento-3',
    seguidorId: 'usuario-1',
    seguidoId: 'usuario-5',
    criadoEm: '2025-03-02T10:00:00.000Z',
  },
  {
    id: 'seguimento-4',
    seguidorId: 'usuario-2',
    seguidoId: 'usuario-1',
    criadoEm: '2025-01-17T10:00:00.000Z',
  },
  {
    id: 'seguimento-5',
    seguidorId: 'usuario-2',
    seguidoId: 'usuario-4',
    criadoEm: '2025-02-20T10:00:00.000Z',
  },
  {
    id: 'seguimento-6',
    seguidorId: 'usuario-3',
    seguidoId: 'usuario-1',
    criadoEm: '2025-02-05T10:00:00.000Z',
  },
  {
    id: 'seguimento-7',
    seguidorId: 'usuario-4',
    seguidoId: 'usuario-1',
    criadoEm: '2025-02-22T10:00:00.000Z',
  },
  {
    id: 'seguimento-8',
    seguidorId: 'usuario-4',
    seguidoId: 'usuario-2',
    criadoEm: '2025-02-23T10:00:00.000Z',
  },
  {
    id: 'seguimento-9',
    seguidorId: 'usuario-4',
    seguidoId: 'usuario-3',
    criadoEm: '2025-02-24T10:00:00.000Z',
  },
]

function getAll() {
  return readCollection(COLECAO, seguimentosFixture)
}

async function listarSeguidores(usuarioId) {
  await delay(300)
  return getAll().filter((seguimento) => seguimento.seguidoId === usuarioId)
}

async function listarSeguindo(usuarioId) {
  await delay(300)
  return getAll().filter((seguimento) => seguimento.seguidorId === usuarioId)
}

async function verificarSegue(seguidorId, seguidoId) {
  await delay(150)
  return getAll().some(
    (seguimento) => seguimento.seguidorId === seguidorId && seguimento.seguidoId === seguidoId,
  )
}

async function seguir(seguidorId, seguidoId) {
  await delay(300)

  if (seguidorId === seguidoId) {
    throw new MockServiceError('Não é possível seguir a própria conta.')
  }

  const seguimentos = getAll()
  const jaSegue = seguimentos.some(
    (seguimento) => seguimento.seguidorId === seguidorId && seguimento.seguidoId === seguidoId,
  )
  if (jaSegue) {
    throw new MockServiceError('Você já segue este usuário.')
  }

  const novo = {
    id: generateId('seguimento'),
    seguidorId,
    seguidoId,
    criadoEm: new Date().toISOString(),
  }

  writeCollection(COLECAO, [...seguimentos, novo])
  return novo
}

async function deixarDeSeguir(seguidorId, seguidoId) {
  await delay(300)
  const seguimentos = getAll()
  const existe = seguimentos.some(
    (seguimento) => seguimento.seguidorId === seguidorId && seguimento.seguidoId === seguidoId,
  )

  if (!existe) {
    throw new MockServiceError('Você não segue este usuário.')
  }

  writeCollection(
    COLECAO,
    seguimentos.filter(
      (seguimento) => !(seguimento.seguidorId === seguidorId && seguimento.seguidoId === seguidoId),
    ),
  )
}

const seguimentoService = {
  listarSeguidores,
  listarSeguindo,
  verificarSegue,
  seguir,
  deixarDeSeguir,
}

export { seguimentoService }
