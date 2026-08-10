import { Link } from 'react-router-dom'

import { FollowButton } from './FollowButton'
import { UserAvatar } from './UserAvatar'
import buttonStyles from '../styles/components/Button.module.css'
import styles from '../styles/components/ProfileHeader.module.css'

/**
 * Capa do Perfil — avatar, nome, bio e a ação certa conforme quem visita: dono vê "Editar Perfil"
 * (`Link` estilizada como `Button`, mesmo padrão de `LandingHero`/`LandingCTA`, Etapa 9 — é
 * navegação de verdade, não um `onClick`); visitante vê `FollowButton`. `aoMudarSegue` só é usado
 * quando visitante — repassado direto pra `FollowButton` (ver o comentário lá).
 * @param {{
 *   perfil: object,
 *   dono: boolean,
 *   usuarioAtualId: string,
 *   aoMudarSegue?: (segue: boolean) => void,
 * }} props
 */
function ProfileHeader({ perfil, dono, usuarioAtualId, aoMudarSegue }) {
  return (
    <div className={styles.wrapper}>
      <UserAvatar name={perfil.nome} src={perfil.fotoUrl} size="lg" />
      <div className={styles.info}>
        <h1 className={styles.nome}>{perfil.nome}</h1>
        {perfil.bio ? <p className={styles.bio}>{perfil.bio}</p> : null}
        <div className={styles.acao}>
          {dono ? (
            <Link
              to="/perfil/editar"
              className={`${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.sm}`}
            >
              Editar Perfil
            </Link>
          ) : (
            <FollowButton
              seguidorId={usuarioAtualId}
              seguidoId={perfil.id}
              aoMudarSegue={aoMudarSegue}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export { ProfileHeader }
