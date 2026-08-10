import { useCallback } from 'react'

import { itemDaEstanteService } from '../services/itemDaEstanteService'
import { livroService } from '../services/livroService'
import { useAsync } from './useAsync'

const NOMES_MESES = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

/**
 * Quantos livros "lido" (`ItemDaEstante`) o usuário tem num ano específico — a data de leitura é
 * aproximada por `atualizadoEm` (`itemDaEstanteService` atualiza esse campo toda vez que o status
 * muda, inclusive na transição pra "lido"; não existe um campo "concluidoEm" dedicado). Exportada
 * separada de `agregarEstatisticasDeLeitura` porque `useMetaDeLeitura`/Meta de Leitura também
 * precisa dela isolada (progresso da meta é sempre de um ano específico, diferente do resto das
 * estatísticas, que são agregadas de todo o histórico).
 * @param {object[]} itensDaEstante
 * @param {number} ano
 */
function contarLivrosLidosNoAno(itensDaEstante, ano) {
  return itensDaEstante.filter(
    (item) => item.status === 'lido' && new Date(item.atualizadoEm).getFullYear() === ano,
  ).length
}

/**
 * Agregação pura das Estatísticas de Leitura (#16), Relatório Anual (#17) e Meta de Leitura (#19) —
 * sem chamar nenhum service, sem estado, só transforma os dados já carregados. Testável direto
 * (`useReadingStats.test.js`), sem precisar renderizar nada — exigência da Etapa 17.
 *
 * Agregado de **todo o histórico**, não só "o ano corrente": a fixture (`itemDaEstanteService`,
 * Etapa 7) tem datas de 2025, fixas na história do produto — usar `new Date().getFullYear()` (o
 * relógio real de quem roda o projeto) descasaria dessas datas sempre que o projeto for aberto num
 * ano diferente de quando a fixture foi escrita, fazendo as Estatísticas parecerem vazias sem
 * motivo. `livrosPorMes` agrupa por nome do mês (Jan-Dez) através de todos os anos presentes, pelo
 * mesmo motivo — evita depender de "qual é o ano corrente" pra ter algum dado pra mostrar.
 *
 * `anoReferencia` (usado só por Meta de Leitura, que É por ano, por definição do próprio
 * `MetaDeLeitura.ano`): o ano mais recente em que o usuário concluiu algum livro; cai pra
 * `new Date().getFullYear()` só quando não há nenhum livro lido ainda (usuário novo, sem histórico
 * — aí faz sentido a meta já nascer no ano real corrente).
 *
 * @param {object[]} itensDaEstante - todos os itens do usuário, qualquer status (a função filtra
 *   "lido" sozinha — quem chama não precisa pré-filtrar)
 * @param {object[]} livros - catálogo inteiro, pra cruzar `livroId` com gênero/autor/páginas
 * @returns {{
 *   totalLivrosLidos: number,
 *   totalPaginasLidas: number,
 *   distribucaoPorGenero: { genero: string, quantidade: number, livros: object[] }[],
 *   generoFavorito: string | null,
 *   autorMaisLido: string | null,
 *   livrosPorMes: { mes: string, quantidade: number }[],
 *   anoReferencia: number,
 *   livrosLidosNoAnoReferencia: number,
 * }}
 */
function agregarEstatisticasDeLeitura(itensDaEstante, livros) {
  const itensLidos = itensDaEstante
    .filter((item) => item.status === 'lido')
    .map((item) => ({ ...item, livro: livros.find((livro) => livro.id === item.livroId) }))
    .filter((item) => item.livro)

  const totalLivrosLidos = itensLidos.length
  const totalPaginasLidas = itensLidos.reduce(
    (soma, item) => soma + (item.livro.numeroPaginas ?? 0),
    0,
  )

  const distribucaoPorGenero = contarPorChave(itensLidos, (item) => item.livro.genero)
  const distribucaoPorAutor = contarPorChave(itensLidos, (item) => item.livro.autor)

  const contagemPorMes = new Array(12).fill(0)
  for (const item of itensLidos) {
    contagemPorMes[new Date(item.atualizadoEm).getMonth()] += 1
  }
  const livrosPorMes = NOMES_MESES.map((mes, indice) => ({
    mes,
    quantidade: contagemPorMes[indice],
  }))

  const anos = itensLidos.map((item) => new Date(item.atualizadoEm).getFullYear())
  const anoReferencia = anos.length > 0 ? Math.max(...anos) : new Date().getFullYear()

  return {
    totalLivrosLidos,
    totalPaginasLidas,
    distribucaoPorGenero,
    generoFavorito: distribucaoPorGenero[0]?.genero ?? null,
    autorMaisLido: distribucaoPorAutor[0]?.genero ?? null,
    livrosPorMes,
    anoReferencia,
    livrosLidosNoAnoReferencia: contarLivrosLidosNoAno(itensDaEstante, anoReferencia),
  }
}

/** Agrupa por `chave(item)` e devolve `{ genero, quantidade, livros }[]` ordenado do mais pro menos
 * frequente — reaproveitada tanto pra gênero quanto pra autor (campo devolvido chama-se sempre
 * `genero` por simplicidade; quem usa pra autor só lê `genero`/`quantidade`, ignora `livros`).
 * `livros` (usado por `GenreBreakdown`, Etapa 17: "descobrir qual livro foi lido em cada gênero") já
 * vem cada um o próprio objeto `Livro` cruzado, não precisa de outro `find` em quem consome. */
function contarPorChave(itens, chave) {
  const grupos = new Map()
  for (const item of itens) {
    const valor = chave(item)
    if (!grupos.has(valor)) {
      grupos.set(valor, [])
    }
    grupos.get(valor).push(item.livro)
  }
  return [...grupos.entries()]
    .map(([genero, livros]) => ({ genero, quantidade: livros.length, livros }))
    .sort((a, b) => b.quantidade - a.quantidade)
}

/**
 * Estatísticas de Leitura do usuário — busca `ItemDaEstante`/`Livro` (Etapas 7/12/13) e aplica
 * `agregarEstatisticasDeLeitura`. Sem service próprio (a Descrição da etapa é explícita: "não é uma
 * nova fonte de dado primário, é uma função pura de agregação").
 * @param {string} usuarioId
 */
function useReadingStats(usuarioId) {
  const buscar = useCallback(async () => {
    const [itensDaEstante, livros] = await Promise.all([
      itemDaEstanteService.listarPorUsuario(usuarioId),
      livroService.listar(),
    ])
    return agregarEstatisticasDeLeitura(itensDaEstante, livros)
  }, [usuarioId])

  return useAsync(buscar)
}

export { useReadingStats, agregarEstatisticasDeLeitura, contarLivrosLidosNoAno }
