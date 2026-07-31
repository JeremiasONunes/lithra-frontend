import { useCallback } from 'react'

import { livroService } from '../services/livroService'
import { useAsync } from './useAsync'

const TAMANHO_PAGINA = 6

/**
 * Livros em destaque pra Descobrir (#6) — independente do grafo social do usuário.
 *
 * Paginação client-side simples, mesmo padrão de `useFeed` (Etapa 14): a cada `pagina`, a busca
 * recalcula a lista inteira (mock, poucos registros) e devolve só os primeiros
 * `TAMANHO_PAGINA * pagina` itens — sem estado de acumulação separado. `DescobrirPage` incrementa
 * `pagina` automaticamente (lazy load via `useLazyLoadGatilho`, sem botão "carregar mais").
 * @param {number} pagina - a partir de 1
 * @returns {{ dado: { itens: object[], total: number } | null, carregando: boolean, erro: unknown, recarregar: () => void }}
 */
function useLivrosEmDestaque(pagina) {
  const buscar = useCallback(async () => {
    const emDestaque = await livroService.listarEmDestaque()
    return {
      itens: emDestaque.slice(0, TAMANHO_PAGINA * pagina),
      total: emDestaque.length,
    }
  }, [pagina])

  return useAsync(buscar)
}

export { useLivrosEmDestaque }
