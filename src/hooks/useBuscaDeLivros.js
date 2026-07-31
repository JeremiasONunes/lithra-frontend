import { useCallback } from 'react'

import { livroService } from '../services/livroService'
import { useAsync } from './useAsync'

const TAMANHO_PAGINA = 6

/**
 * Busca livros por título, autor ou gênero (mesmo campo cobre os três) — `query` controlada por
 * quem chama (normalmente só muda quando o usuário confirma a busca, não a cada tecla digitada; ver
 * `BuscarLivroPage`). Termo vazio já resolve pro catálogo inteiro dentro do próprio
 * `livroService.buscarPorTitulo`, sem lançar erro.
 *
 * Paginação client-side simples, mesmo padrão de `useFeed`/`useLivrosEmDestaque`: a cada `pagina`,
 * a busca recalcula a lista inteira (mock, poucos registros) e devolve só os primeiros
 * `TAMANHO_PAGINA * pagina` itens. `BuscarLivroPage` incrementa `pagina` automaticamente (lazy load
 * via `useLazyLoadGatilho`, sem botão "carregar mais") e reseta pra `1` a cada nova busca.
 * @param {string} query
 * @param {number} pagina - a partir de 1
 * @returns {{ dado: { itens: object[], total: number } | null, carregando: boolean, erro: unknown, recarregar: () => void }}
 */
function useBuscaDeLivros(query, pagina) {
  const buscar = useCallback(async () => {
    const resultados = await livroService.buscarPorTitulo(query)
    return {
      itens: resultados.slice(0, TAMANHO_PAGINA * pagina),
      total: resultados.length,
    }
  }, [query, pagina])

  return useAsync(buscar)
}

export { useBuscaDeLivros }
