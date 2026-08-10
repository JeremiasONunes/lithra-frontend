import { Users } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { FollowList } from '../components/FollowList'
import { PageHeader } from '../components/PageHeader'
import { PageStateBoundary } from '../components/PageStateBoundary'
import { useAuth } from '../context/AuthContext'
import { usePerfil } from '../hooks/usePerfil'
import { useSeguidores } from '../hooks/useSeguidores'
import { useSeguindo } from '../hooks/useSeguindo'
import { useUsuarios } from '../hooks/useUsuarios'
import styles from '../styles/pages/FollowListPage.module.css'

const ROTULOS = { seguidores: 'Seguidores', seguindo: 'Seguindo' }

/**
 * Seguidores/Seguindo (#10) — uma página pra duas rotas (`/perfil/:username/seguidores` e
 * `/perfil/:username/seguindo`, via prop `tipo` vinda de `routeConfig.jsx`), mesmo padrão de
 * `PlaceholderPage` recebendo `title`. Abas de verdade (`Link`, não `onClick`) — a URL muda de fato
 * entre as duas listas, diferente de `ShelfStatusTabs` (Etapa 13, estado local).
 *
 * Chama `useSeguidores`/`useSeguindo` incondicionalmente (não dá pra escolher qual hook chamar com
 * base em `tipo` — regra dos hooks do React) e descarta o resultado não usado; ambos são leituras
 * mock pequenas e baratas, sem custo real de rede.
 * @param {{ tipo: 'seguidores' | 'seguindo' }} props
 */
function FollowListPage({ tipo }) {
  const { username: perfilId } = useParams()
  const { usuario: usuarioAtual } = useAuth()

  const { dado: perfil } = usePerfil(perfilId)
  const { dado: usuarios } = useUsuarios()
  const resultadoSeguidores = useSeguidores(perfilId)
  const resultadoSeguindo = useSeguindo(perfilId)

  const {
    dado: registros,
    carregando,
    erro,
    recarregar,
  } = tipo === 'seguidores' ? resultadoSeguidores : resultadoSeguindo

  const usuariosDaLista = (registros ?? [])
    .map((registro) =>
      usuarios?.find(
        (usuario) =>
          usuario.id === (tipo === 'seguidores' ? registro.seguidorId : registro.seguidoId),
      ),
    )
    .filter(Boolean)

  return (
    <div className={styles.wrapper}>
      <PageHeader title={ROTULOS[tipo]} />
      {perfil ? <p className={styles.subtitulo}>de {perfil.nome}</p> : null}
      <div className={styles.abas}>
        <Link
          to={`/perfil/${perfilId}/seguidores`}
          className={`${styles.aba} ${tipo === 'seguidores' ? styles.ativa : ''}`}
        >
          Seguidores
        </Link>
        <Link
          to={`/perfil/${perfilId}/seguindo`}
          className={`${styles.aba} ${tipo === 'seguindo' ? styles.ativa : ''}`}
        >
          Seguindo
        </Link>
      </div>
      <PageStateBoundary
        carregando={carregando}
        erro={erro}
        recarregar={recarregar}
        vazio={!carregando && !erro && usuariosDaLista.length === 0}
        estadoVazio={{
          icon: Users,
          title: tipo === 'seguidores' ? 'Ainda sem seguidores' : 'Ainda não segue ninguém',
        }}
      >
        <FollowList usuarios={usuariosDaLista} usuarioAtualId={usuarioAtual.id} />
      </PageStateBoundary>
    </div>
  )
}

export { FollowListPage }
