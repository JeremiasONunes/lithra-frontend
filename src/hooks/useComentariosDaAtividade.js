import { useCallback } from 'react'

import { comentarioService } from '../services/comentarioService'
import { useAsync } from './useAsync'

/**
 * Comentários de uma atividade do feed. `atividadeId` vem `null` enquanto o painel de comentários
 * (`ActivityComments`) está fechado — evita buscar comentários de cards cujo painel nunca foi
 * aberto; `comentarioService.listarPorAtividade(null)` só devolve lista vazia, sem lançar erro.
 * @param {string | null} atividadeId
 */
function useComentariosDaAtividade(atividadeId) {
  const buscar = useCallback(() => comentarioService.listarPorAtividade(atividadeId), [atividadeId])
  return useAsync(buscar)
}

export { useComentariosDaAtividade }
