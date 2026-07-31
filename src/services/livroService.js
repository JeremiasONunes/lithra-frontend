import { MockServiceError, delay, generateId, readCollection, writeCollection } from './mockStorage'

const COLECAO = 'livros'

/**
 * @typedef {Object} Livro
 * @property {string} id
 * @property {string} titulo
 * @property {string} autor - texto simples, não uma entidade normalizada (normalização de banco
 *   relacional é assunto do back-end futuro, fora do escopo desta camada mock)
 * @property {string} genero
 * @property {string} [capaUrl]
 * @property {string} sinopse
 * @property {number} numeroPaginas
 * @property {number} ano
 * @property {number} mediaAvaliacoes - derivado por `avaliacaoService` a cada avaliação criada/
 *   editada/removida; nunca editado diretamente por outro service
 * @property {number} totalAvaliacoes - mesma origem de `mediaAvaliacoes`
 */

/**
 * Fixture determinística. `livro-4`, `livro-9` e `livro-12` ficam sem avaliação de propósito, para
 * testar o estado "sem avaliações ainda" (`mediaAvaliacoes`/`totalAvaliacoes` zerados aqui batem
 * com a ausência desses ids em `avaliacaoService`).
 * @type {Livro[]}
 */
const livrosFixture = [
  {
    id: 'livro-1',
    titulo: 'O Hobbit',
    autor: 'J.R.R. Tolkien',
    genero: 'Fantasia',
    sinopse: 'Bilbo Bolseiro é convocado para uma aventura inesperada rumo à Montanha Solitária.',
    numeroPaginas: 310,
    ano: 1937,
    mediaAvaliacoes: 4.5,
    totalAvaliacoes: 2,
  },
  {
    id: 'livro-2',
    titulo: 'Duna',
    autor: 'Frank Herbert',
    genero: 'Ficção Científica',
    sinopse:
      'Em um planeta desértico, Paul Atreides enfrenta intrigas políticas e um destino maior.',
    numeroPaginas: 688,
    ano: 1965,
    mediaAvaliacoes: 5,
    totalAvaliacoes: 1,
  },
  {
    id: 'livro-3',
    titulo: 'Dom Casmurro',
    autor: 'Machado de Assis',
    genero: 'Clássico Brasileiro',
    sinopse: 'Bentinho narra, décadas depois, a história de seu amor e ciúme por Capitu.',
    numeroPaginas: 256,
    ano: 1899,
    mediaAvaliacoes: 4,
    totalAvaliacoes: 1,
  },
  {
    id: 'livro-4',
    titulo: 'Atomic Habits',
    autor: 'James Clear',
    genero: 'Desenvolvimento Pessoal',
    sinopse: 'Pequenas mudanças de hábito, compostas ao longo do tempo, geram resultados notáveis.',
    numeroPaginas: 320,
    ano: 2018,
    mediaAvaliacoes: 0,
    totalAvaliacoes: 0,
  },
  {
    id: 'livro-5',
    titulo: 'Circe',
    autor: 'Madeline Miller',
    genero: 'Fantasia',
    sinopse: 'A feiticeira Circe é exilada em uma ilha e precisa encontrar seu próprio poder.',
    numeroPaginas: 400,
    ano: 2018,
    mediaAvaliacoes: 4.7,
    totalAvaliacoes: 3,
  },
  {
    id: 'livro-6',
    titulo: 'A Biblioteca da Meia-Noite',
    autor: 'Matt Haig',
    genero: 'Ficção',
    sinopse:
      'Entre a vida e a morte, uma biblioteca infinita guarda cada vida que Nora poderia ter vivido.',
    numeroPaginas: 288,
    ano: 2020,
    mediaAvaliacoes: 4.5,
    totalAvaliacoes: 2,
  },
  {
    id: 'livro-7',
    titulo: 'O Morro dos Ventos Uivantes',
    autor: 'Emily Brontë',
    genero: 'Clássico',
    sinopse: 'Uma história de amor obsessivo e vingança nos pântanos ingleses.',
    numeroPaginas: 416,
    ano: 1847,
    mediaAvaliacoes: 3.5,
    totalAvaliacoes: 2,
  },
  {
    id: 'livro-8',
    titulo: 'Sapiens: Uma Breve História da Humanidade',
    autor: 'Yuval Noah Harari',
    genero: 'Não Ficção',
    sinopse: 'Como o Homo sapiens conquistou o planeta, da Revolução Cognitiva à era digital.',
    numeroPaginas: 464,
    ano: 2011,
    mediaAvaliacoes: 5,
    totalAvaliacoes: 1,
  },
  {
    id: 'livro-9',
    titulo: 'O Nome do Vento',
    autor: 'Patrick Rothfuss',
    genero: 'Fantasia',
    sinopse: 'Kvothe narra sua própria lenda: de criança de trupe itinerante a mago temido.',
    numeroPaginas: 662,
    ano: 2007,
    mediaAvaliacoes: 0,
    totalAvaliacoes: 0,
  },
  {
    id: 'livro-10',
    titulo: 'Capitães da Areia',
    autor: 'Jorge Amado',
    genero: 'Clássico Brasileiro',
    sinopse: 'Um grupo de meninos de rua em Salvador luta pela sobrevivência e pela liberdade.',
    numeroPaginas: 280,
    ano: 1937,
    mediaAvaliacoes: 4,
    totalAvaliacoes: 1,
  },
  {
    id: 'livro-11',
    titulo: '1984',
    autor: 'George Orwell',
    genero: 'Distopia',
    sinopse:
      'Sob a vigilância constante do Grande Irmão, Winston Smith questiona um regime totalitário.',
    numeroPaginas: 328,
    ano: 1949,
    mediaAvaliacoes: 4.5,
    totalAvaliacoes: 2,
  },
  {
    id: 'livro-12',
    titulo: 'A Menina que Roubava Livros',
    autor: 'Markus Zusak',
    genero: 'Ficção Histórica',
    sinopse:
      'Na Alemanha nazista, Liesel encontra consolo roubando livros e compartilhando histórias.',
    numeroPaginas: 464,
    ano: 2005,
    mediaAvaliacoes: 0,
    totalAvaliacoes: 0,
  },
]

function getAll() {
  return readCollection(COLECAO, livrosFixture)
}

async function listar() {
  await delay(300)
  return getAll()
}

async function buscarPorId(id) {
  await delay(200)
  return getAll().find((livro) => livro.id === id)
}

/** Livros em destaque pra Descobrir (Etapa 15) — catálogo inteiro ordenado do mais pro menos bem
 * avaliado, independente do grafo social do usuário (Descobrir não filtra por quem o usuário segue,
 * ver Descrição da etapa). Sem campo novo no schema — "destaque" é derivado de `mediaAvaliacoes`,
 * não uma seleção editorial hard-coded. Devolve tudo, não só um recorte fixo: `useLivrosEmDestaque`
 * pagina o resultado (lazy load, mesmo padrão de `useFeed`). */
async function listarEmDestaque() {
  await delay(300)
  return [...getAll()].sort((a, b) => b.mediaAvaliacoes - a.mediaAvaliacoes)
}

/** Busca por título, autor ou gênero — mesmo campo de busca cobre os três, simula o que, com API
 * real, seria a consulta a um catálogo externo (Etapa 12). Termo vazio devolve o catálogo inteiro
 * (campo de busca vazio = "mostrar todos os livros", não "nenhum resultado"). Resultado vazio de
 * uma busca com termo é um caso de sucesso válido ("livro não encontrado, cadastre manualmente"),
 * não um erro. */
async function buscarPorTitulo(query) {
  await delay(500)
  const termo = query.trim().toLowerCase()
  if (!termo) {
    return getAll()
  }
  return getAll().filter(
    (livro) =>
      livro.titulo.toLowerCase().includes(termo) ||
      livro.autor.toLowerCase().includes(termo) ||
      livro.genero.toLowerCase().includes(termo),
  )
}

async function criar(dados) {
  await delay(400)
  const livros = getAll()

  const novoLivro = {
    ...dados,
    id: generateId('livro'),
    mediaAvaliacoes: 0,
    totalAvaliacoes: 0,
  }

  writeCollection(COLECAO, [...livros, novoLivro])
  return novoLivro
}

async function atualizar(id, dados) {
  await delay(300)
  const livros = getAll()
  const index = livros.findIndex((livro) => livro.id === id)

  if (index === -1) {
    throw new MockServiceError('Livro não encontrado.')
  }

  const atualizado = { ...livros[index], ...dados }
  const proximos = [...livros]
  proximos[index] = atualizado
  writeCollection(COLECAO, proximos)
  return atualizado
}

const livroService = {
  listar,
  buscarPorId,
  buscarPorTitulo,
  listarEmDestaque,
  criar,
  atualizar,
}

export { livroService, livrosFixture }
