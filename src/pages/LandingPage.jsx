import { LandingCTA } from '../components/LandingCTA'
import { LandingFeatures } from '../components/LandingFeatures'
import { LandingHero } from '../components/LandingHero'
import styles from '../styles/pages/LandingPage.module.css'

function LandingPage() {
  return (
    <div className={styles.wrapper}>
      <LandingHero />
      <LandingFeatures />
      <LandingCTA />
    </div>
  )
}

export { LandingPage }
