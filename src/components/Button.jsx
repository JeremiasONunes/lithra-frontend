import styles from '../styles/components/Button.module.css'

/** Botão pílula clay — variantes `primary`/`secondary`/`ghost`. Estado pressionado resolvido com
 * `:active` em CSS puro (o kit de referência usa `onMouseDown`/`onMouseUp` porque não tem CSS Module
 * — aqui não precisamos disso). */
function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export { Button }
