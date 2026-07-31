import { useCallback } from 'react'

import { livroService } from '../services/livroService'
import { useAsync } from './useAsync'

/** Livros em destaque pra Descobrir (#6) — independente do grafo social do usuário. */
function useLivrosEmDestaque() {
  const buscar = useCallback(() => livroService.listarEmDestaque(), [])
  return useAsync(buscar)
}

export { useLivrosEmDestaque }
