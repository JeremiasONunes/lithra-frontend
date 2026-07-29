import { Outlet } from 'react-router-dom'

import styles from '../styles/components/AdminLayout.module.css'

/** Espaço da navegação administrativa reservado aqui — só ganha conteúdo real na Etapa 19. */
function AdminLayout() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.navPlaceholder}>Navegação administrativa (Etapa 19)</div>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}

export { AdminLayout }
