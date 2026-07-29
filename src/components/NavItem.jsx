import { NavLink } from 'react-router-dom'

import styles from '../styles/components/NavItem.module.css'

/**
 * Um item de `AppNavigation` — `NavLink` (não `Link`) porque a indicação de rota ativa já vem
 * pronta do React Router, sem comparar `pathname` manualmente. `exato` repassa pro `end` do
 * `NavLink`: sem isso, uma rota que é prefixo de outra (ex.: `/admin` de `/admin/catalogo`) fica
 * marcada como ativa nas duas ao mesmo tempo.
 * @param {{ rota: string, rotulo: string, icon: import('react').ComponentType, exato?: boolean }} props
 */
function NavItem({ rota, rotulo, icon: Icon, exato }) {
  return (
    <NavLink
      to={rota}
      end={exato}
      className={({ isActive }) => `${styles.item} ${isActive ? styles.ativo : ''}`}
    >
      <Icon size={20} aria-hidden="true" />
      <span className={styles.rotulo}>{rotulo}</span>
    </NavLink>
  )
}

export { NavItem }
