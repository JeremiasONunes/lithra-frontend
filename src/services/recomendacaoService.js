import { delay } from './mockStorage'
import { avaliacaoService } from './avaliacaoService'
import { itemDaEstanteService } from './itemDaEstanteService'
import { livroService } from './livroService'

const NOTA_MINIMA_PARA_GENERO_FAVORITO = 4
const MAXIMO_RECOMENDACOES = 6

/**
 * @typedef {Object} Recomendacao
 * @property {string} livroId
 * @property {string} justificativa - texto pronto pra exibir (Critério de Aceite: recomendação
 *   nunca aparece só com a capa, sempre com uma justificativa)
 */

/**
 * Serviço isolado de propósito (Checklist Técnico da Etapa 15: "ponto de integração futura com
 * ML") — a implementação de hoje deriva recomendações do próprio dado mock (gênero mais bem
 * avaliado pelo usuário + livros que ele ainda não tem na estante), mas a assinatura pública
 * (`listarPorUsuario` devolvendo `Recomendacao[]` já com `justificativa`) é o contrato que uma API
 * real de recomendação por Machine Learning (fora do escopo deste roadmap) assume no lugar —
 * trocar o que tem aqui dentro não deveria exigir mudar `useRecomendacoes`/`RecomendadosPage`.
 */
async function listarPorUsuario(usuarioId) {
  await delay(400)

  const [avaliacoes, itensDaEstante, livros] = await Promise.all([
    avaliacaoService.listarPorUsuario(usuarioId),
    itemDaEstanteService.listarPorUsuario(usuarioId),
    livroService.listar(),
  ])

  const livroPorId = new Map(livros.map((livro) => [livro.id, livro]))
  const idsNaEstante = new Set(itensDaEstante.map((item) => item.livroId))
  const candidatos = livros.filter((livro) => !idsNaEstante.has(livro.id))

  const generoFavorito = generoMaisBemAvaliado(avaliacoes, livroPorId)

  if (generoFavorito) {
    const doGeneroFavorito = candidatos
      .filter((livro) => livro.genero === generoFavorito)
      .sort((a, b) => b.mediaAvaliacoes - a.mediaAvaliacoes)
      .slice(0, MAXIMO_RECOMENDACOES)

    if (doGeneroFavorito.length > 0) {
      return doGeneroFavorito.map((livro) => ({
        livroId: livro.id,
        justificativa: `Porque você gostou de ${generoFavorito}`,
      }))
    }
  }

  // Sem gênero favorito identificado (usuário ainda não avaliou nada com nota alta) ou nenhum
  // livro do gênero favorito sobrou fora da estante — cai pros mais bem avaliados da comunidade em
  // geral, pra recomendação nunca vir vazia enquanto existir algum livro fora da estante do leitor.
  return candidatos
    .sort((a, b) => b.mediaAvaliacoes - a.mediaAvaliacoes)
    .slice(0, MAXIMO_RECOMENDACOES)
    .map((livro) => ({
      livroId: livro.id,
      justificativa: 'Um dos livros mais bem avaliados da comunidade',
    }))
}

/** Gênero com mais avaliações de nota alta (`>= NOTA_MINIMA_PARA_GENERO_FAVORITO`) dadas pelo
 * usuário — `null` se ele ainda não deu nenhuma nota alta. */
function generoMaisBemAvaliado(avaliacoes, livroPorId) {
  const contagemPorGenero = new Map()

  for (const avaliacao of avaliacoes) {
    if (avaliacao.nota < NOTA_MINIMA_PARA_GENERO_FAVORITO) continue
    const livro = livroPorId.get(avaliacao.livroId)
    if (!livro) continue
    contagemPorGenero.set(livro.genero, (contagemPorGenero.get(livro.genero) ?? 0) + 1)
  }

  let generoFavorito = null
  let maiorContagem = 0
  for (const [genero, contagem] of contagemPorGenero) {
    if (contagem > maiorContagem) {
      generoFavorito = genero
      maiorContagem = contagem
    }
  }
  return generoFavorito
}

const recomendacaoService = {
  listarPorUsuario,
}

export { recomendacaoService }
