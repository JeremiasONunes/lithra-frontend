import { Button } from './Button'
import { IconChip } from './IconChip'
import styles from '../styles/components/EmptyState.module.css'

/**
 * Ilustração (chip de ícone grande) + texto + ação, para listas vazias.
 * @param {{
 *   icon: import('react').ComponentType,
 *   title: string,
 *   description?: string,
 *   actionLabel?: string,
 *   onAction?: () => void,
 * }} props
 */
function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <div className={styles.wrapper}>
      <IconChip icon={icon} tone="surface" size="lg" />
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.description}>{description}</p> : null}
      {actionLabel && onAction ? (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}

export { EmptyState }
