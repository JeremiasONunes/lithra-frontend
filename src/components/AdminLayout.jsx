import { Outlet } from 'react-router-dom'

import { AppNavigation } from './AppNavigation'
import styles from '../styles/components/AdminLayout.module.css'

/** `AppNavigation` (Etapa 10) substitui o placeholder de navegação administrativa da Etapa 5 — o
 * mesmo componente de `ReaderLayout`, os itens é que mudam por papel (`useNavigationItems`). O
 * conteúdo real das telas de admin (Dashboard, Catálogo...) continua para a Etapa 19; esta etapa só
 * traz a navegação. */
function AdminLayout() {
  return (
    <div className={styles.wrapper}>
      <AppNavigation />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}

export { AdminLayout }
