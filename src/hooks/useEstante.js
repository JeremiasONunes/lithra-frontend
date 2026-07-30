import { useCallback } from 'react'

import { itemDaEstanteService } from '../services/itemDaEstanteService'
import { useAsync } from './useAsync'

/**
 * Estante do usuário logado, filtrada por status (repassado direto pro service, que já suporta
 * esse filtro). Devolve os `ItemDaEstante` crus, sem cruzar com o livro — o cruzamento acontece em
 * `EstantePage` (que já precisa dele pra calcular as opções do filtro de gênero), mesmo padrão já
 * usado em `BookPage`/`ReviewList` (Etapa 12) pra cruzar avaliação com usuário.
 * @param {string} usuarioId
 * @param {{ status?: import('../services/itemDaEstanteService').StatusLeitura }} [filtros]
 */
function useEstante(usuarioId, filtros = {}) {
  const { status } = filtros

  const buscar = useCallback(
    () => itemDaEstanteService.listarPorUsuario(usuarioId, status),
    [usuarioId, status],
  )

  return useAsync(buscar)
}

export { useEstante }
