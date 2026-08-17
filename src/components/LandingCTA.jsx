import { Link } from 'react-router-dom'

import buttonStyles from '../styles/components/Button.module.css'
import styles from '../styles/components/LandingCTA.module.css'

/**
 * Segunda chamada para ação da Landing Page, no fim da rolagem da página —
 * mesma técnica de `LandingHero` (`Link` estilizado com as classes de
 * `Button`, não um `<button>`; ver a explicação teórica completa lá:
 * navegação de verdade merece um elemento `<a>` de verdade, não um botão
 * com `onClick`). Existir DUAS chamadas para ação na mesma página (uma no
 * topo, em `LandingHero`, outra aqui no fim) é decisão de UX deliberada: um
 * visitante que rolou a página inteira até aqui já leu os benefícios em
 * `LandingFeatures` e está mais convencido — não deveria precisar rolar de
 * volta ao topo só para encontrar o botão de criar conta de novo.
 */
function LandingCTA() {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.titulo}>Pronto para começar?</h2>
      <Link
        to="/cadastro"
        className={`${buttonStyles.button} ${buttonStyles.primary} ${buttonStyles.lg}`}
      >
        Criar minha conta
      </Link>
    </section>
  )
}

export { LandingCTA }
