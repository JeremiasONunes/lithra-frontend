import { Link } from 'react-router-dom'

import logo from '../assets/logo.png'
import styles from '../styles/components/AuthHeader.module.css'

/** Cabeçalho compartilhado pelas 4 telas públicas (Landing, Login, Cadastro, Recuperar Senha) —
 * renderizado uma vez em `PublicLayout`, não repetido em cada página. `alt=""` na logo: o nome
 * "Lythra" ao lado já transmite a mesma informação, uma segunda leitura pelo leitor de tela seria
 * redundante. O link "Entrar" fica sempre visível (mesmo em Login/Cadastro/Recuperar Senha, onde é
 * levemente redundante) — mais simples do que esconder condicionalmente por rota, e garante que
 * quem já tem conta sempre encontra o caminho de volta pro login a partir de qualquer página
 * pública, inclusive a Landing (que só empurrava pra `/cadastro` antes disso). Visual de pílula
 * (mesma forma do `Button` `ghost`), mas com CSS próprio em vez das classes de `Button.module.css`
 * — assim dá pra manter a aparência sem herdar o `:hover` com fundo claro do `ghost`, que ficava
 * estranho solto no cabeçalho. */
function AuthHeader() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.marca}>
        <img src={logo} alt="" className={styles.logo} />
        <span className={styles.nome}>Lythra</span>
      </Link>
      <Link to="/login" className={styles.entrar}>
        Entrar
      </Link>
    </header>
  )
}

export { AuthHeader }
