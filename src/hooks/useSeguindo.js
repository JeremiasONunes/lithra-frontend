import { useCallback } from 'react'

import { seguimentoService } from '../services/seguimentoService'
import { useAsync } from './useAsync'

/**
 * Quem `usuarioId` segue — devolve os `Seguimento` crus, mesmo raciocínio de `useSeguidores`
 * (cruzamento com o usuário seguido feito em `FollowListPage`).
 * @param {string} usuarioId
 */
function useSeguindo(usuarioId) {
  const buscar = useCallback(() => seguimentoService.listarSeguindo(usuarioId), [usuarioId])
  return useAsync(buscar)
}

export { useSeguindo }
