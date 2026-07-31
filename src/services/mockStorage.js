const PREFIXO = 'lythra:mock:'

/** Toda coleção conhecida pelo mock — usado só por `resetMockData()` pra saber o que apagar. Cada
 * `entidadeService.js` usa sua própria chave aqui ao ler/escrever. */
const COLECOES = [
  'usuarios',
  'livros',
  'avaliacoes',
  'itensDaEstante',
  'atividadesDoFeed',
  'comentariosDoFeed',
  'seguimentos',
  'metasDeLeitura',
]

function chaveDe(colecao) {
  return `${PREFIXO}${colecao}`
}

/**
 * Lê uma coleção do `localStorage`. Se a chave ainda não existir (primeiro acesso desta sessão de
 * navegador), semeia com `fixture` e persiste antes de retornar — não existe um passo de "bootstrap"
 * separado: a primeira leitura de qualquer service já semeia sua própria coleção.
 */
function readCollection(colecao, fixture) {
  const chave = chaveDe(colecao)
  const bruto = localStorage.getItem(chave)

  if (bruto === null) {
    const semeada = [...fixture]
    localStorage.setItem(chave, JSON.stringify(semeada))
    return semeada
  }

  return JSON.parse(bruto)
}

function writeCollection(colecao, dados) {
  localStorage.setItem(chaveDe(colecao), JSON.stringify(dados))
}

/**
 * Restaura todas as coleções mockadas ao estado inicial das fixtures, apagando o namespace do mock
 * no `localStorage`. Usado nos testes (`beforeEach`/`afterEach`) e disponível pra depuração manual
 * sem precisar limpar o navegador inteiro — a próxima leitura de cada coleção resemeia a partir da
 * fixture.
 */
function resetMockData() {
  for (const colecao of COLECOES) {
    localStorage.removeItem(chaveDe(colecao))
  }
}

/** Simula latência de rede. */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Erro da camada mock — distingue uma falha simulada de rede de um bug de programação. */
class MockServiceError extends Error {
  constructor(message = 'Falha simulada de rede') {
    super(message)
    this.name = 'MockServiceError'
  }
}

/**
 * Simula uma falha de rede com a probabilidade dada (0 a 1). Lança `MockServiceError` quando a
 * "falha" ocorre; não faz nada quando não ocorre. `Math.random()` aqui é intencional e não viola a
 * regra de fixture determinística (Checklist Técnico) — essa regra é sobre os DADOS de fixture,
 * sempre fixos, não sobre a simulação de latência/falha de rede, que é aleatória por natureza.
 * `probability` default 0: quem não passa argumento não corre risco de falha simulada.
 */
function maybeFail(probability = 0, message) {
  if (probability > 0 && Math.random() < probability) {
    throw new MockServiceError(message)
  }
}

/** Gera um id único e legível para registros criados em tempo de execução. */
function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export {
  readCollection,
  writeCollection,
  resetMockData,
  delay,
  maybeFail,
  generateId,
  MockServiceError,
}
