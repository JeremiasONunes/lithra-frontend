import { Outlet } from 'react-router-dom'

import { AuthHeader } from './AuthHeader'
import styles from '../styles/components/PublicLayout.module.css'

/** `AuthHeader` (Etapa 9) renderizado uma vez aqui, não repetido em cada uma das 4 páginas
 * públicas — era só `<Outlet />` até a Etapa 5, quando nenhuma tela real existia ainda. */
function PublicLayout() {
  return (
    <div className={styles.wrapper}>
      <AuthHeader />
      <main className={styles.conteudo}>
        <Outlet />
      </main>
    </div>
  )
}

export { PublicLayout }
