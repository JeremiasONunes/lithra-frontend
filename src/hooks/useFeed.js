import { useCallback } from 'react'

import { atividadeDoFeedService } from '../services/atividadeDoFeedService'
import { seguimentoService } from '../services/seguimentoService'
import { useAsync } from './useAsync'

const TAMANHO_PAGINA = 6

/**
 * Timeline do usuário logado — atividades dele mesmo + de quem ele segue (não só "quem segue":
 * sem incluir o próprio usuário, publicar uma atualização nunca apareceria na própria timeline,
 * contradizendo o Critério de Aceite "publicar aparece no topo do feed sem reload"). Filtrar por
 * seguimento é composto aqui, não no service — `atividadeDoFeedService.listar()` já documenta isso
 * como responsabilidade de quem consome (ver comentário no próprio arquivo).
 *
 * Paginação client-side simples: a cada `pagina`, a busca recalcula a lista inteira (mock, poucos
 * registros) e devolve só os primeiros `TAMANHO_PAGINA * pagina` itens — sem estado de acumulação
 * separado, `dado.itens` já cresce sozinho a cada `pagina` incrementada. `FeedPage` incrementa
 * `pagina` automaticamente (lazy load via `IntersectionObserver`, sem botão "carregar mais").
 * @param {string} usuarioId
 * @param {number} pagina - a partir de 1
 * @returns {{ dado: { itens: object[], total: number } | null, carregando: boolean, erro: unknown, recarregar: () => void }}
 */
function useFeed(usuarioId, pagina) {
  const buscar = useCallback(async () => {
    const [todas, seguindo] = await Promise.all([
      atividadeDoFeedService.listar(),
      seguimentoService.listarSeguindo(usuarioId),
    ])
    const idsRelevantes = new Set([usuarioId, ...seguindo.map((s) => s.seguidoId)])
    const relevantes = todas.filter((atividade) => idsRelevantes.has(atividade.usuarioId))

    return {
      itens: relevantes.slice(0, TAMANHO_PAGINA * pagina),
      total: relevantes.length,
    }
  }, [usuarioId, pagina])

  return useAsync(buscar)
}

export { useFeed }
