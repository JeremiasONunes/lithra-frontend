import { useState } from 'react'
import { UserCheck, UserPlus } from 'lucide-react'

import { useDeixarDeSeguir } from '../hooks/useDeixarDeSeguir'
import { useSegueUsuario } from '../hooks/useSegueUsuario'
import { useSeguir } from '../hooks/useSeguir'
import { Button } from './Button'

/**
 * Seguir/Deixar de seguir, compartilhado entre Perfil, Busca (Etapa 15) e Seguidores/Seguindo —
 * autocontido (resolve seu próprio estado via `useSegueUsuario` e possui as próprias mutations),
 * mesmo raciocínio de `FeedComposer` possuindo `useCriarPost`: cada instância em cada tela onde
 * aparece funciona sozinha, sem precisar de um estado global de "quem eu sigo" — ao montar, sempre
 * lê o estado real (`localStorage`), então nunca fica desatualizado entre telas diferentes; dentro
 * da mesma tela, atualiza a si mesmo direto no retorno da mutation, sem re-buscar (mesmo padrão de
 * `curtidasLocais` no Feed, Etapa 14).
 *
 * Não renderiza nada se `seguidorId`/`seguidoId` coincidirem (ninguém segue a própria conta) — rede
 * de segurança própria, pra qualquer tela que use o componente sem precisar lembrar de filtrar isso.
 *
 * `aoMudarSegue` (opcional): avisa quem chama quando o estado muda por uma ação do próprio botão —
 * necessário só em `ProfilePage`, que também decide (fora deste componente) se mostra a Estante ou
 * o aviso de "Estante privada" com base em "o visitante segue este perfil?". Sem esse callback,
 * seguir alguém de estante privada direto pela própria página de perfil deixaria a Estante escondida
 * até a página recarregar — o botão vira "Seguindo", mas o resto da tela não saberia disso, já que
 * `FollowButton` resolve seu próprio estado numa instância de hook separada da de quem o usa.
 * @param {{ seguidorId: string, seguidoId: string, aoMudarSegue?: (segue: boolean) => void }} props
 */
function FollowButton({ seguidorId, seguidoId, aoMudarSegue }) {
  const { dado: segueInicial, carregando } = useSegueUsuario(seguidorId, seguidoId)
  const [segueLocal, setSegueLocal] = useState(null)

  const { seguir, enviando: seguindo } = useSeguir(() => {
    setSegueLocal(true)
    aoMudarSegue?.(true)
  })
  const { deixarDeSeguir, enviando: deixandoDeSeguir } = useDeixarDeSeguir(() => {
    setSegueLocal(false)
    aoMudarSegue?.(false)
  })

  if (seguidorId === seguidoId) return null

  const segue = segueLocal ?? segueInicial ?? false
  const enviando = seguindo || deixandoDeSeguir

  function aoClicar() {
    if (segue) {
      deixarDeSeguir(seguidorId, seguidoId)
    } else {
      seguir(seguidorId, seguidoId)
    }
  }

  return (
    <Button
      type="button"
      variant={segue ? 'secondary' : 'primary'}
      size="sm"
      onClick={aoClicar}
      disabled={carregando || enviando}
      aria-pressed={segue}
    >
      {segue ? (
        <UserCheck size={16} aria-hidden="true" />
      ) : (
        <UserPlus size={16} aria-hidden="true" />
      )}
      {segue ? 'Seguindo' : 'Seguir'}
    </Button>
  )
}

export { FollowButton }
