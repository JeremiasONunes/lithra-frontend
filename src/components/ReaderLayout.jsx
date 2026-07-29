import { Outlet } from 'react-router-dom'

import { AppNavigation } from './AppNavigation'
import styles from '../styles/components/ReaderLayout.module.css'

/** `AppNavigation` (Etapa 10) substitui o placeholder de navegação da Etapa 5. */
function ReaderLayout() {
  return (
    <div className={styles.wrapper}>
      <AppNavigation />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}

export { ReaderLayout }
