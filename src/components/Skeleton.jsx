import styles from './Skeleton.module.css'

/** Placeholder de carregamento — não existe no `Lythra Design System` (o kit não define um). Sempre
 * `aria-hidden`: é puramente visual, sem conteúdo para anunciar; quem compõe uma lista de `Skeleton`
 * (Etapa 6) é responsável por um `role="status"` no contêiner ao redor. */
function Skeleton({ width = '100%', height = '16px', circle = false, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`${styles.skeleton} ${circle ? styles.circle : ''} ${className}`}
      style={{ width, height }}
    />
  )
}

export { Skeleton }
