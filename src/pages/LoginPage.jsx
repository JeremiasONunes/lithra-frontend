import { LoginForm } from '../components/LoginForm'
import styles from '../styles/pages/LoginPage.module.css'

function LoginPage() {
  return (
    <div className={styles.wrapper}>
      <LoginForm />
    </div>
  )
}

export { LoginPage }
