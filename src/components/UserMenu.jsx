import { useEffect, useRef, useState } from 'react'
import { Settings, User } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { UserAvatar } from './UserAvatar'
import styles from '../styles/components/UserMenu.module.css'

/** Menu do usuário — avatar como gatilho, lista de ações. Fecha ao clicar fora e ao pressionar
 * `Esc`, implementado na mão (mesmo padrão "Menu suspenso" documentado em
 * `01-arquitetura-frontend.md`). `usuario` nunca é `null` aqui: `UserMenu` só é renderizado dentro
 * de `AppNavigation`, que só existe atrás de `RequireAuth`. "Sair" não está mais aqui — virou botão
 * próprio, sempre visível, ao lado do avatar (`AppNavigation.jsx`). */
function UserMenu() {
  const { usuario } = useAuth()
  const [aberto, setAberto] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!aberto) return

    function aoClicarFora(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setAberto(false)
      }
    }

    function aoPressionarTecla(event) {
      if (event.key === 'Escape') setAberto(false)
    }

    document.addEventListener('mousedown', aoClicarFora)
    document.addEventListener('keydown', aoPressionarTecla)
    return () => {
      document.removeEventListener('mousedown', aoClicarFora)
      document.removeEventListener('keydown', aoPressionarTecla)
    }
  }, [aberto])

  return (
    <div className={styles.wrapper} ref={menuRef}>
      <button
        type="button"
        className={styles.gatilho}
        onClick={() => setAberto((atual) => !atual)}
        aria-haspopup="true"
        aria-expanded={aberto}
        aria-label={`Menu de ${usuario.nome}`}
      >
        <UserAvatar name={usuario.nome} src={usuario.fotoUrl} size="sm" />
      </button>
      {aberto ? (
        <ul className={styles.menu} role="menu">
          <li role="none">
            <Link
              to={`/perfil/${usuario.id}`}
              role="menuitem"
              className={styles.item}
              onClick={() => setAberto(false)}
            >
              <User size={16} aria-hidden="true" />
              Meu Perfil
            </Link>
          </li>
          <li role="none">
            <Link
              to="/configuracoes"
              role="menuitem"
              className={styles.item}
              onClick={() => setAberto(false)}
            >
              <Settings size={16} aria-hidden="true" />
              Configurações
            </Link>
          </li>
        </ul>
      ) : null}
    </div>
  )
}

export { UserMenu }
