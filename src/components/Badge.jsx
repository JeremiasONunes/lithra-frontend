import styles from '../styles/components/Badge.module.css'

function Badge({ children, tone = 'neutral', className = '' }) {
  return <span className={`${styles.badge} ${styles[tone]} ${className}`}>{children}</span>
}

export { Badge }
