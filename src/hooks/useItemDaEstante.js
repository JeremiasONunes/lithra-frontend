import { useCallback } from 'react'

import { itemDaEstanteService } from '../services/itemDaEstanteService'
import { useAsync } from './useAsync'

/**
 * Busca o `ItemDaEstante` de um usuário para um livro específico (`undefined` se ainda não
 * adicionado) — usado por `BookPage` pra decidir o estado do botão "Adicionar à Estante"
 * (desabilitado desde a Etapa 12, ligado de verdade só agora). Não está na lista de Hooks da Etapa
 * 13 no roadmap, mas sem ele `BookPage` chamaria `itemDaEstanteService` direto — mesmo raciocínio de
 * `useUsuarios.js`/`useCadastrarLivro.js` (Etapa 12).
 * @param {string} usuarioId
 * @param {string} livroId
 */
function useItemDaEstante(usuarioId, livroId) {
  const buscar = useCallback(
    () => itemDaEstanteService.buscarPorUsuarioELivro(usuarioId, livroId),
    [usuarioId, livroId],
  )
  return useAsync(buscar)
}

export { useItemDaEstante }
