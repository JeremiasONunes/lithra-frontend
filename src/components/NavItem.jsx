import { NavLink } from 'react-router-dom'

import styles from '../styles/components/NavItem.module.css'

/**
 * Um item de `AppNavigation` — `NavLink` (não `Link`) porque a indicação de rota ativa já vem
 * pronta do React Router, sem comparar `pathname` manualmente.
 * @param {{ rota: string, rotulo: string, icon: import('react').ComponentType }} props
 */
function NavItem({ rota, rotulo, icon: Icon }) {
  return (
    <NavLink
      to={rota}
      className={({ isActive }) => `${styles.item} ${isActive ? styles.ativo : ''}`}
    >
      <Icon size={20} aria-hidden="true" />
      <span className={styles.rotulo}>{rotulo}</span>
    </NavLink>
  )
}

export { NavItem }
