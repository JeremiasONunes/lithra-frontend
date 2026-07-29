import styles from './Textarea.module.css'

/** Mesmo tratamento visual do `Input` (Etapa 4), em versão multilinha. Não existe no
 * `Lythra Design System` (o kit não tem textarea) — estilo derivado por analogia direta do `Input`. */
function Textarea({ label, id, error, className = '', ...props }) {
  return (
    <div className={styles.field}>
      {label ? (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      ) : null}
      <textarea
        id={id}
        aria-invalid={!!error}
        className={`${styles.textarea} ${error ? styles.error : ''} ${className}`}
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

export { Textarea }
