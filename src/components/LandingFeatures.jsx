import { BarChart2, BookOpen, Sparkles, Users } from 'lucide-react'

import { Card } from './Card'
import { IconChip } from './IconChip'
import styles from '../styles/components/LandingFeatures.module.css'

/** Mesmas 4 funcionalidades de destaque da tela de referência do Design System — "Recomendações por
 * IA" reflete o módulo de Machine Learning já previsto pro back-end (ver `CLAUDE.md`), não uma
 * funcionalidade inventada nesta etapa. */
const FUNCIONALIDADES = [
  { icon: BookOpen, titulo: 'Estante pessoal' },
  { icon: Users, titulo: 'Feed social' },
  { icon: BarChart2, titulo: 'Estatísticas' },
  { icon: Sparkles, titulo: 'Recomendações por IA' },
]

function LandingFeatures() {
  return (
    <section className={styles.grade}>
      {FUNCIONALIDADES.map(({ icon, titulo }) => (
        <Card key={titulo} className={styles.item}>
          <IconChip icon={icon} tone="primary" />
          <span className={styles.titulo}>{titulo}</span>
        </Card>
      ))}
    </section>
  )
}

export { LandingFeatures }
