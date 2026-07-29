import { forwardRef } from 'react'

import styles from '../styles/components/Input.module.css'

/** Campo de texto clay entalhado — `error` mostra a mensagem e liga `aria-invalid`. Sem ícone
 * embutido (o kit de referência tem um slot de ícone; aqui quem precisa posiciona o próprio ícone
 * por cima, mantendo este componente simples de ler).
 *
 * `forwardRef` (Etapa 9): `react-hook-form`'s `register()` devolve um `ref` que precisa chegar no
 * `<input>` real do DOM pra conseguir ler o valor do campo — sem isto, todo campo chega sempre
 * `undefined` na submissão, mesmo com o usuário digitando normalmente. */
const Input = forwardRef(function Input({ label, id, error, className = '', ...props }, ref) {
  return (
    <div className={styles.field}>
      {label ? (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
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
})

export { Input }
