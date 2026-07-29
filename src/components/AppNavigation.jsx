import { LogOut } from 'lucide-react'

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
 *
 * "Sair" fica como botão próprio, sempre visível ao lado do avatar — não só dentro do menu suspenso
 * (`UserMenu`), que exige um clique a mais pra revelar uma ação tão frequente.
 */
function AppNavigation() {
  const { papel, logout } = useAuth()
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
        <button type="button" className={styles.sair} onClick={logout} aria-label="Sair">
          <LogOut size={20} aria-hidden="true" />
          {/* Escondido no mobile (barra inferior sem espaço sobrando) — `aria-label` acima garante
           * o nome acessível mesmo sem o texto visível; reaparece no desktop. */}
          <span className={styles.sairRotulo}>Sair</span>
        </button>
      </div>
    </nav>
  )
}

export { AppNavigation }
