import { EditProfileForm } from '../components/EditProfileForm'
import { PageHeader } from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/pages/EditarPerfilPage.module.css'

/** Editar Perfil (#9) — sempre o próprio usuário logado. `onSalvo` sincroniza `AuthContext`, senão
 * `UserMenu`/o próprio `ProfilePage` (se navegado de volta) mostrariam dado desatualizado. */
function EditarPerfilPage() {
  const { usuario, atualizarUsuario } = useAuth()

  return (
    <div className={styles.wrapper}>
      <PageHeader title="Editar Perfil" />
      <EditProfileForm usuario={usuario} onSalvo={atualizarUsuario} />
    </div>
  )
}

export { EditarPerfilPage }
