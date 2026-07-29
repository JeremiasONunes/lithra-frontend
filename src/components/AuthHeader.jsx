import { Link } from 'react-router-dom'

import logo from '../assets/logo.png'
import styles from '../styles/components/AuthHeader.module.css'

/** Cabeçalho compartilhado pelas 4 telas públicas (Landing, Login, Cadastro, Recuperar Senha) —
 * renderizado uma vez em `PublicLayout`, não repetido em cada página. `alt=""` na logo: o nome
 * "Lythra" ao lado já transmite a mesma informação, uma segunda leitura pelo leitor de tela seria
 * redundante. */
function AuthHeader() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.marca}>
        <img src={logo} alt="" className={styles.logo} />
        <span className={styles.nome}>Lythra</span>
      </Link>
    </header>
  )
}

export { AuthHeader }
