import { Link } from 'react-router-dom'

import { FollowButton } from './FollowButton'
import { UserAvatar } from './UserAvatar'
import styles from '../styles/components/FollowList.module.css'

/**
 * Lista de usuários com `FollowButton` por linha — compartilhada entre Busca (leitores, Etapa 15) e
 * Seguidores/Seguindo (`FollowListPage`), extraída da versão original de `UnifiedSearchResults`
 * (que só mostrava o resultado, sem ação — `FollowButton` era componente desta etapa, ainda não
 * implementado quando a Busca foi construída).
 * @param {{ usuarios: object[], usuarioAtualId: string }} props
 */
function FollowList({ usuarios, usuarioAtualId }) {
  return (
    <ul className={styles.lista}>
      {usuarios.map((usuario) => (
        <li key={usuario.id} className={styles.item}>
          <Link to={`/perfil/${usuario.id}`} className={styles.perfilLink}>
            <UserAvatar name={usuario.nome} src={usuario.fotoUrl} size="md" />
            <div className={styles.info}>
              <span className={styles.nome}>{usuario.nome}</span>
              {usuario.bio ? <span className={styles.bio}>{usuario.bio}</span> : null}
            </div>
          </Link>
          <FollowButton seguidorId={usuarioAtualId} seguidoId={usuario.id} />
        </li>
      ))}
    </ul>
  )
}

export { FollowList }
