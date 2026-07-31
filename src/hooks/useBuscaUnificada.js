import { useCallback } from 'react'

import { livroService } from '../services/livroService'
import { usuarioService } from '../services/usuarioService'
import { useAsync } from './useAsync'

/**
 * Busca unificada (#7) — livros e leitores no mesmo termo, resultados combinados num só objeto
 * (`{ livros, leitores }`). Termo vazio devolve os dois vazios sem nem chamar os services — ao
 * contrário de `useBuscaDeLivros` (Etapa 12), aqui campo vazio significa "ainda não buscou nada",
 * não "mostrar tudo" (misturaria o catálogo inteiro com todos os leitores logo ao abrir a página).
 * @param {string} query
 */
function useBuscaUnificada(query) {
  const buscar = useCallback(async () => {
    const termo = query.trim()
    if (!termo) {
      return { livros: [], leitores: [] }
    }

    const [livros, leitores] = await Promise.all([
      livroService.buscarPorTitulo(termo),
      usuarioService.buscarPorNome(termo),
    ])
    return { livros, leitores }
  }, [query])

  return useAsync(buscar)
}

export { useBuscaUnificada }
