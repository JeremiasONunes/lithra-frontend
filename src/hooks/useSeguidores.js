import { useCallback } from 'react'

import { seguimentoService } from '../services/seguimentoService'
import { useAsync } from './useAsync'

/**
 * Quem segue `usuarioId` — devolve os `Seguimento` crus, sem cruzar com o usuário seguidor. O
 * cruzamento acontece em `FollowListPage` (que já precisa de `useUsuarios()` carregado em massa pra
 * outras telas), mesmo padrão já usado em `EstantePage` (Etapa 13) pra cruzar `ItemDaEstante` com
 * `Livro`.
 * @param {string} usuarioId
 */
function useSeguidores(usuarioId) {
  const buscar = useCallback(() => seguimentoService.listarSeguidores(usuarioId), [usuarioId])
  return useAsync(buscar)
}

export { useSeguidores }
