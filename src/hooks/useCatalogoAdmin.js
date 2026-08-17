import { useCallback } from 'react'

import { livroService } from '../services/livroService'
import { useAsync } from './useAsync'

/**
 * Lista todos os livros pra Gestão de Catálogo (#22, Etapa 19) — hook próprio, dedicado ao admin,
 * em vez de reaproveitar `useLivros` (Etapa 13): mesmo raciocínio já registrado lá ("não está na
 * lista de Hooks da etapa no roadmap, mas sem hook próprio a página chamaria o service direto") —
 * aqui é o oposto, o roadmap desta etapa nomeia `useCatalogoAdmin` explicitamente, então não reusa
 * `useLivros` por trás de um nome genérico que esconderia o propósito administrativo.
 */
function useCatalogoAdmin() {
  const buscar = useCallback(() => livroService.listar(), [])
  return useAsync(buscar)
}

export { useCatalogoAdmin }
