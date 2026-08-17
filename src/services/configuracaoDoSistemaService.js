import { delay, readCollection, writeCollection } from './mockStorage'

const COLECAO = 'configuracaoDoSistema'

/**
 * @typedef {Object} ConfiguracaoDoSistema
 * @property {string} nomeDaPlataforma
 * @property {string} emailDeSuporte
 * @property {boolean} permiteNovosCadastros - `false` bloqueia `/cadastro` a nível de produto; a
 *   Etapa 19 só guarda o parâmetro (mockado) — aplicar essa checagem no fluxo real de Cadastro
 *   (Etapa 9) está fora do escopo desta etapa, não pedido no Checklist Técnico
 */

/**
 * Fixture de um único registro — "chave/valor simples" (Descrição da Etapa 19), sem lista de
 * múltiplos registros como as demais entidades. Guardada como array de 1 item só pra reaproveitar
 * `readCollection`/`writeCollection` (Etapa 7) sem criar um formato de armazenamento especial só
 * pra esta entidade.
 * @type {ConfiguracaoDoSistema[]}
 */
const configuracaoDoSistemaFixture = [
  {
    nomeDaPlataforma: 'Lythra',
    emailDeSuporte: 'suporte@lythra.com',
    permiteNovosCadastros: true,
  },
]

function getAtual() {
  return readCollection(COLECAO, configuracaoDoSistemaFixture)[0]
}

async function obter() {
  await delay(300)
  return getAtual()
}

async function atualizar(dados) {
  await delay(300)
  const atualizada = { ...getAtual(), ...dados }
  writeCollection(COLECAO, [atualizada])
  return atualizada
}

const configuracaoDoSistemaService = {
  obter,
  atualizar,
}

export { configuracaoDoSistemaService }
