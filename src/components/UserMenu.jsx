import { useEffect, useRef, useState } from 'react'
import { LogOut, Settings, User } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { UserAvatar } from './UserAvatar'
import styles from '../styles/components/UserMenu.module.css'

/** Menu do usuário — avatar (+ nome, só no desktop) como gatilho, lista de ações (Meu Perfil,
 * Configurações, Sair). Fecha ao clicar fora e ao pressionar `Esc`, implementado na mão (mesmo
 * padrão "Menu suspenso" documentado em `01-arquitetura-frontend.md`). `usuario` nunca é `null`
 * aqui: `UserMenu` só é renderizado dentro de `AppNavigation`, que só existe atrás de
 * `RequireAuth`. */
function UserMenu() {
  const { usuario, logout } = useAuth()
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
        {/* Escondido no mobile (barra inferior sem espaço sobrando) — o `aria-label` acima garante
         * o nome acessível mesmo sem o texto visível; reaparece no desktop. */}
        <span className={styles.nome}>{usuario.nome}</span>
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
          <li role="none">
            <button type="button" role="menuitem" className={styles.item} onClick={logout}>
              <LogOut size={16} aria-hidden="true" />
              Sair
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  )
}

export { UserMenu }
