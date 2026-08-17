import { LoginForm } from '../components/LoginForm'
import styles from '../styles/pages/LoginPage.module.css'

/**
 * Login (#2) — rota `/login`.
 *
 * Mesmo padrão de `LandingPage.jsx`: a página só posiciona o componente
 * (`styles.wrapper` centraliza o `LoginForm` na tela, ver o CSS) — toda a
 * lógica de autenticação (formulário, validação, chamada a `useAuth`,
 * redirecionamento por papel) mora dentro de `LoginForm`, não aqui. Essa
 * "página vazia por fora" é o sinal de que a separação página/componente
 * está funcionando: se um dia o Login precisasse de um layout diferente
 * (por exemplo, uma coluna lateral com uma imagem), só este arquivo mudaria
 * — `LoginForm` continuaria podendo ser usado em qualquer lugar, sem alterar
 * uma linha da lógica de autenticação.
 */
function LoginPage() {
  return (
    <div className={styles.wrapper}>
      <LoginForm />
    </div>
  )
}

export { LoginPage }
