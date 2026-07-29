import styles from './Input.module.css'

/** Campo de texto clay entalhado — `error` mostra a mensagem e liga `aria-invalid`. Sem ícone
 * embutido (o kit de referência tem um slot de ícone; aqui quem precisa posiciona o próprio ícone
 * por cima, mantendo este componente simples de ler). */
function Input({ label, id, error, className = '', ...props }) {
  return (
    <div className={styles.field}>
      {label ? (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      ) : null}
      <input
        id={id}
        aria-invalid={!!error}
        className={`${styles.input} ${error ? styles.error : ''} ${className}`}
        {...props}
      />
      {error ? (
        <span role="alert" className={styles.errorText}>
          {error}
        </span>
      ) : null}
    </div>
  )
}

export { Input }
