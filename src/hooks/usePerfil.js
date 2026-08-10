import { useCallback } from 'react'

import { usuarioService } from '../services/usuarioService'
import { useAsync } from './useAsync'

/**
 * Lê um perfil de usuário por id — `dado` vem `undefined` se o id não existir (não é erro, mesmo
 * contrato de `useLivro`; a página decide como tratar "não encontrado").
 * @param {string} usuarioId
 */
function usePerfil(usuarioId) {
  const buscar = useCallback(() => usuarioService.buscarPorId(usuarioId), [usuarioId])
  return useAsync(buscar)
}

export { usePerfil }
