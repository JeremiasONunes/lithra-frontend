import { Link } from 'react-router-dom'

import logo from '../assets/logo.png'
import buttonStyles from '../styles/components/Button.module.css'
import styles from '../styles/components/LandingHero.module.css'

/** `Link` estilizada com as classes de `Button` (não um `<button onClick={navigate}>`) — é
 * navegação de verdade (troca de rota), não uma ação com efeito colateral, então o elemento certo é
 * `<a>`/`Link`, com o clique direito/abrir em nova guia funcionando como esperado. */
function LandingHero() {
  return (
    <section className={styles.hero}>
      <img src={logo} alt="Lythra" className={styles.logo} />
      <h1 className={styles.titulo}>Sua estante, seu ritmo.</h1>
      <p className={styles.subtitulo}>
        Registre o que você lê, avalie, acompanhe suas estatísticas e descubra novos livros através
        de quem você segue.
      </p>
      <Link
        to="/cadastro"
        className={`${buttonStyles.button} ${buttonStyles.primary} ${buttonStyles.lg}`}
      >
        Comece a ler com a gente
      </Link>
    </section>
  )
}

export { LandingHero }
