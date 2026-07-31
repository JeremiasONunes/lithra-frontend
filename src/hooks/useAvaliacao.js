import { useCallback } from 'react'

import { avaliacaoService } from '../services/avaliacaoService'
import { useAsync } from './useAsync'

/**
 * Lê uma avaliação específica por id — usado por `ActivityCard` (atividade tipo "avaliacao") pra
 * mostrar nota/resenha no feed. Não está na lista de Hooks da Etapa 14 no roadmap, mas sem ele o
 * componente chamaria `avaliacaoService` direto — mesmo raciocínio de `useUsuarios`/`useLivros`
 * (Etapas 12/13). `avaliacaoService.buscarPorId` já existe desde a Etapa 7, nenhuma mudança de
 * service precisou ser feita.
 * @param {string} avaliacaoId
 */
function useAvaliacao(avaliacaoId) {
  const buscar = useCallback(() => avaliacaoService.buscarPorId(avaliacaoId), [avaliacaoId])
  return useAsync(buscar)
}

export { useAvaliacao }
