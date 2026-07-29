import { useAuth } from '../context/AuthContext'
import { useNavigationItems } from '../hooks/useNavigationItems'
import { NavItem } from './NavItem'
import { UserMenu } from './UserMenu'
import styles from '../styles/components/AppNavigation.module.css'

/**
 * Componente único de navegação — barra lateral em telas largas, barra inferior fixa em telas
 * estreitas (mobile first, `styles/components/AppNavigation.module.css`). Usada tanto por
 * `ReaderLayout` quanto por `AdminLayout`: os itens vêm de `useNavigationItems(papel)`, nunca
 * hard-coded por layout — é isso que garante "mesma navegação, mesmos itens" por papel (Critério de
 * Aceite desta etapa).
 */
function AppNavigation() {
  const { papel } = useAuth()
  const itens = useNavigationItems(papel)

  return (
    <nav className={styles.nav} aria-label="Navegação principal">
      <ul className={styles.lista}>
        {itens.map((item) => (
          <li key={item.rota}>
            <NavItem {...item} />
          </li>
        ))}
      </ul>
      <div className={styles.rodape}>
        <UserMenu />
      </div>
    </nav>
  )
}

export { AppNavigation }
