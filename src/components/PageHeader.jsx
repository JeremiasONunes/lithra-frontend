import { Button } from './Button'
import styles from '../styles/components/PageHeader.module.css'

/**
 * Título de página + ação primária opcional.
 * @param {{
 *   title: string,
 *   actionLabel?: string,
 *   onAction?: () => void,
 *   actionIcon?: import('react').ComponentType,
 * }} props
 */
function PageHeader({ title, actionLabel, onAction, actionIcon: ActionIcon }) {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{title}</h1>
      {actionLabel && onAction ? (
        <Button variant="primary" onClick={onAction}>
          {ActionIcon ? <ActionIcon size={18} aria-hidden="true" /> : null}
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}

export { PageHeader }
