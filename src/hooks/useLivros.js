import { useCallback } from 'react'

import { livroService } from '../services/livroService'
import { useAsync } from './useAsync'

/**
 * Lista todos os livros — usado por `EstantePage` pra cruzar cada `ItemDaEstante` com o livro
 * correspondente (capa/título/autor/gênero que `ShelfGrid`/`ShelfFilterByGenre` precisam). Não está
 * na lista de Hooks da Etapa 13 no roadmap, mas sem um hook próprio aqui a página chamaria
 * `livroService` direto — mesmo raciocínio de `useUsuarios.js` (Etapa 12).
 */
function useLivros() {
  const buscar = useCallback(() => livroService.listar(), [])
  return useAsync(buscar)
}

export { useLivros }
