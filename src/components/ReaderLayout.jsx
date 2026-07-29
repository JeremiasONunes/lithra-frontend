import { Outlet } from 'react-router-dom'

import styles from '../styles/components/ReaderLayout.module.css'

/** Espaço da navegação principal reservado aqui — só ganha conteúdo real na Etapa 10. */
function ReaderLayout() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.navPlaceholder}>Navegação principal (Etapa 10)</div>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}

export { ReaderLayout }
