import { BookOpen, UserCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { StatCard } from './StatCard'
import styles from '../styles/components/ProfileStatsSummary.module.css'

/**
 * 3 `StatCard` (Etapa 6) — Seguidores/Seguindo linkam pras respectivas listas (Seguidores/Seguindo
 * são navegação de verdade, por isso `Link` envolvendo o card em vez de `onClick`, mesmo raciocínio
 * de `LandingHero`); Livros Lidos não linka (não existe rota dedicada a essa lista nesta etapa).
 * @param {{
 *   perfilId: string,
 *   totalSeguidores: number,
 *   totalSeguindo: number,
 *   totalLivrosLidos: number,
 * }} props
 */
function ProfileStatsSummary({ perfilId, totalSeguidores, totalSeguindo, totalLivrosLidos }) {
  return (
    <div className={styles.grade}>
      <Link to={`/perfil/${perfilId}/seguidores`} className={styles.link}>
        <StatCard label="Seguidores" value={totalSeguidores} icon={Users} tone="primary" />
      </Link>
      <Link to={`/perfil/${perfilId}/seguindo`} className={styles.link}>
        <StatCard label="Seguindo" value={totalSeguindo} icon={UserCheck} tone="secondary" />
      </Link>
      <StatCard label="Livros Lidos" value={totalLivrosLidos} icon={BookOpen} tone="accent" />
    </div>
  )
}

export { ProfileStatsSummary }
