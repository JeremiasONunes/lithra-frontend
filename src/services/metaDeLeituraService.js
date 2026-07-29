import { MockServiceError, delay, generateId, readCollection, writeCollection } from './mockStorage'

const COLECAO = 'metasDeLeitura'

/**
 * @typedef {Object} MetaDeLeitura
 * @property {string} id
 * @property {string} usuarioId
 * @property {number} ano
 * @property {number} metaLivros
 * @property {string} criadoEm - data ISO 8601
 * @property {string} atualizadoEm - data ISO 8601
 */

/**
 * Fixture determinística. Propositalmente sem um campo "livros lidos": quantos livros já foram
 * lidos é derivado, em tempo de leitura, a partir de `itemDaEstanteService` (status "lido" no ano) —
 * Etapa 17. Guardar essa contagem aqui também criaria duas fontes da verdade que poderiam
 * dessincronizar. `usuario-3` de propósito não tem meta cadastrada para 2025 — testa o estado
 * "nenhuma meta definida ainda".
 * @type {MetaDeLeitura[]}
 */
const metasDeLeituraFixture = [
  {
    id: 'meta-1',
    usuarioId: 'usuario-1',
    ano: 2025,
    metaLivros: 20,
    criadoEm: '2025-01-05T10:00:00.000Z',
    atualizadoEm: '2025-01-05T10:00:00.000Z',
  },
  {
    id: 'meta-2',
    usuarioId: 'usuario-2',
    ano: 2025,
    metaLivros: 12,
    criadoEm: '2025-01-08T10:00:00.000Z',
    atualizadoEm: '2025-01-08T10:00:00.000Z',
  },
  {
    id: 'meta-3',
    usuarioId: 'usuario-4',
    ano: 2025,
    metaLivros: 15,
    criadoEm: '2025-01-10T10:00:00.000Z',
    atualizadoEm: '2025-01-10T10:00:00.000Z',
  },
]

function getAll() {
  return readCollection(COLECAO, metasDeLeituraFixture)
}

async function buscarPorUsuarioEAno(usuarioId, ano) {
  await delay(200)
  return getAll().find((meta) => meta.usuarioId === usuarioId && meta.ano === ano)
}

async function criar(dados) {
  await delay(400)
  const metas = getAll()

  if (metas.some((meta) => meta.usuarioId === dados.usuarioId && meta.ano === dados.ano)) {
    throw new MockServiceError('Já existe uma meta de leitura para este ano.')
  }

  const agora = new Date().toISOString()
  const nova = {
    ...dados,
    id: generateId('meta'),
    criadoEm: agora,
    atualizadoEm: agora,
  }

  writeCollection(COLECAO, [...metas, nova])
  return nova
}

async function atualizar(id, dados) {
  await delay(300)
  const metas = getAll()
  const index = metas.findIndex((meta) => meta.id === id)

  if (index === -1) {
    throw new MockServiceError('Meta de leitura não encontrada.')
  }

  const atualizada = {
    ...metas[index],
    ...dados,
    atualizadoEm: new Date().toISOString(),
  }
  const proximas = [...metas]
  proximas[index] = atualizada
  writeCollection(COLECAO, proximas)
  return atualizada
}

const metaDeLeituraService = {
  buscarPorUsuarioEAno,
  criar,
  atualizar,
}

export { metaDeLeituraService }
