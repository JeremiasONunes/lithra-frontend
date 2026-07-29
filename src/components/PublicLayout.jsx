import { Outlet } from 'react-router-dom'

import styles from '../styles/components/PublicLayout.module.css'

function PublicLayout() {
  return (
    <div className={styles.wrapper}>
      <Outlet />
    </div>
  )
}

export { PublicLayout }
