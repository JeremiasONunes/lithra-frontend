import { useCallback } from 'react'

import { seguimentoService } from '../services/seguimentoService'
import { useAsync } from './useAsync'

/**
 * Se `seguidorId` já segue `seguidoId` — não nomeado na lista de Hooks da Etapa 16 no roadmap, mas
 * necessário: sem ele, `FollowButton` chamaria `seguimentoService` direto pra saber seu próprio
 * estado inicial (violando "nenhuma página/componente chama services/ diretamente"), e `ProfilePage`
 * não teria como aplicar a regra de privacidade da estante ("visitante que não segue não vê").
 * Mesmo raciocínio de `useUsuarios`/`useCadastrarLivro` (Etapa 12), `useItemDaEstante` (Etapa 13).
 * `seguidorId` opcional: `null` quando ainda não há usuário logado resolvido (evita a checagem sem
 * um par de ids válido) — `useAsync` só dispara a busca quando `buscar` está pronto pra rodar, mas
 * aqui é mais simples resolver pra `false` sem nem chamar o service.
 * @param {string | null} seguidorId
 * @param {string} seguidoId
 */
function useSegueUsuario(seguidorId, seguidoId) {
  const buscar = useCallback(() => {
    if (!seguidorId || seguidorId === seguidoId) {
      return Promise.resolve(false)
    }
    return seguimentoService.verificarSegue(seguidorId, seguidoId)
  }, [seguidorId, seguidoId])

  return useAsync(buscar)
}

export { useSegueUsuario }
