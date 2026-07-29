import styles from './Card.module.css'

function Card({ children, onClick, className = '', ...props }) {
  return (
    <div
      className={`${styles.card} ${onClick ? styles.clickable : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export { Card }
