import { useCallback } from 'react'

import { avaliacaoService } from '../services/avaliacaoService'
import { useAsync } from './useAsync'

/** Lista as avaliações de um livro. @param {string} livroId */
function useAvaliacoesDoLivro(livroId) {
  const buscar = useCallback(() => avaliacaoService.listarPorLivro(livroId), [livroId])
  return useAsync(buscar)
}

export { useAvaliacoesDoLivro }
