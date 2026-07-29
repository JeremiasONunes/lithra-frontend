import { Star } from 'lucide-react'

import styles from '../styles/components/RatingStars.module.css'

/**
 * Nota em estrelas — modo leitura (`readOnly`, padrão) ou interativo (`readOnly={false}` +
 * `onChange`).
 * @param {{
 *   value: number,
 *   max?: number,
 *   readOnly?: boolean,
 *   onChange?: (novoValor: number) => void,
 *   size?: number,
 * }} props
 */
function RatingStars({ value, max = 5, readOnly = true, onChange, size = 20 }) {
  const estrelas = Array.from({ length: max }, (_, indice) => indice + 1)

  if (readOnly) {
    return (
      <span
        className={styles.linha}
        role="img"
        aria-label={`Avaliação: ${value} de ${max} estrelas`}
      >
        {estrelas.map((numero) => (
          <Star
            key={numero}
            size={size}
            className={numero <= value ? styles.preenchida : styles.vazia}
            aria-hidden="true"
          />
        ))}
      </span>
    )
  }

  return (
    <span className={styles.linha}>
      {estrelas.map((numero) => (
        <button
          key={numero}
          type="button"
          className={styles.botao}
          onClick={() => onChange(numero)}
          aria-label={`Avaliar com ${numero} ${numero === 1 ? 'estrela' : 'estrelas'}`}
          aria-pressed={numero === value}
        >
          <Star
            size={size}
            className={numero <= value ? styles.preenchida : styles.vazia}
            aria-hidden="true"
          />
        </button>
      ))}
    </span>
  )
}

export { RatingStars }
