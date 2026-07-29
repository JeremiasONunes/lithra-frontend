import { forwardRef } from 'react'

import styles from '../styles/components/Textarea.module.css'

/** Mesmo tratamento visual do `Input` (Etapa 4), em versão multilinha. Não existe no
 * `Lythra Design System` (o kit não tem textarea) — estilo derivado por analogia direta do `Input`.
 *
 * `forwardRef` (Etapa 12, mesmo bug documentado em `Input.jsx` na Etapa 9): `react-hook-form`
 * precisa do `ref` chegando no `<textarea>` real do DOM pra ler o valor do campo — sem isto,
 * `resenha` chegaria sempre `undefined` no `ReviewForm`. */
const Textarea = forwardRef(function Textarea({ label, id, error, className = '', ...props }, ref) {
  return (
    <div className={styles.field}>
      {label ? (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      ) : null}
      <textarea
        ref={ref}
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
})

export { Textarea }
