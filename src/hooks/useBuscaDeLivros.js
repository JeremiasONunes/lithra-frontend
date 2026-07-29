import { useCallback } from 'react'

import { livroService } from '../services/livroService'
import { useAsync } from './useAsync'

/**
 * Busca livros por título/autor — `query` controlada por quem chama (normalmente só muda quando o
 * usuário confirma a busca, não a cada tecla digitada; ver `BuscarLivroPage`). Termo vazio já
 * resolve pra lista vazia dentro do próprio `livroService.buscarPorTitulo`, sem lançar erro.
 * @param {string} query
 */
function useBuscaDeLivros(query) {
  const buscar = useCallback(() => livroService.buscarPorTitulo(query), [query])
  return useAsync(buscar)
}

export { useBuscaDeLivros }
