import { useCallback } from 'react'

import { recomendacaoService } from '../services/recomendacaoService'
import { useAsync } from './useAsync'

/** Recomendações personalizadas do usuário logado — cada item já vem com `justificativa`. */
function useRecomendacoes(usuarioId) {
  const buscar = useCallback(() => recomendacaoService.listarPorUsuario(usuarioId), [usuarioId])
  return useAsync(buscar)
}

export { useRecomendacoes }
