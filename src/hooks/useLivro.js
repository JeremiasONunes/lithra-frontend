import { useCallback } from 'react'

import { livroService } from '../services/livroService'
import { useAsync } from './useAsync'

/**
 * Lê um livro por id — `dado` vem `undefined` se o id não existir na coleção (não é erro, o
 * service não lança nesse caso; a página decide como tratar "não encontrado").
 * @param {string} livroId
 */
function useLivro(livroId) {
  const buscar = useCallback(() => livroService.buscarPorId(livroId), [livroId])
  return useAsync(buscar)
}

export { useLivro }
