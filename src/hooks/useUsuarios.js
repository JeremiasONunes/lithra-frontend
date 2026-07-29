import { useCallback } from 'react'

import { usuarioService } from '../services/usuarioService'
import { useAsync } from './useAsync'

/**
 * Lista todos os usuários — usado por `BookPage` pra resolver nome/foto de quem escreveu cada
 * avaliação (`ReviewList`/`ReviewCard` recebem o autor já resolvido, sem buscar um por um). Não
 * está na lista de Hooks da Etapa 12 no roadmap (não é uma leitura "de livro" nem "de avaliação"),
 * mas sem um hook próprio aqui, a página chamaria `usuarioService` direto, violando a regra de
 * "toda leitura usa hook construído sobre `useAsync`" — mesmo raciocínio de `useCadastrarLivro.js`.
 */
function useUsuarios() {
  const buscar = useCallback(() => usuarioService.listar(), [])
  return useAsync(buscar)
}

export { useUsuarios }
