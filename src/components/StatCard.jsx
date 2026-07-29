import { Card } from './Card'
import { IconChip } from './IconChip'
import styles from '../styles/components/StatCard.module.css'

/**
 * Card de estatística numérica com ícone em chip clay.
 * @param {{
 *   label: string,
 *   value: string | number,
 *   icon: import('react').ComponentType,
 *   tone?: 'primary' | 'secondary' | 'accent',
 * }} props
 */
function StatCard({ label, value, icon, tone = 'primary' }) {
  return (
    <Card className={styles.card}>
      <IconChip icon={icon} tone={tone} />
      <div className={styles.texto}>
        <span className={styles.label}>{label}</span>
        <span className={`${styles.valor} ${styles[tone]}`}>{value}</span>
      </div>
    </Card>
  )
}

export { StatCard }
