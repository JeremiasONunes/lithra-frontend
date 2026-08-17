import { CadastroForm } from '../components/CadastroForm'
import styles from '../styles/pages/CadastroPage.module.css'

/**
 * Cadastro (#3) — rota `/cadastro`.
 *
 * Mesmo padrão de `LandingPage.jsx`/`LoginPage.jsx`: página fina, só
 * posiciona `CadastroForm` na tela. Repare que `LoginPage`, `CadastroPage` e
 * a futura `RecuperarSenhaPage` são praticamente idênticas em estrutura —
 * isso não é repetição acidental, é o padrão do projeto se repetindo de
 * propósito: cada rota pública tem uma página "casca" mínima, e a
 * diferença real de comportamento entre Login/Cadastro/Recuperar Senha vive
 * inteira dentro do respectivo componente de formulário.
 */
function CadastroPage() {
  return (
    <div className={styles.wrapper}>
      <CadastroForm />
    </div>
  )
}

export { CadastroPage }
