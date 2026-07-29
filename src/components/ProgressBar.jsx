import styles from './ProgressBar.module.css'

/** Barra de progresso entalhada. `role="progressbar"` + `aria-value*` — o kit de referência não tem
 * isso, mas uma barra de progresso sem semântica é invisível para leitor de tela. */
function ProgressBar({ value = 0, max = 100, label }) {
  const porcentagem = Math.max(0, Math.min(100, (value / max) * 100))

  return (
    <div className={styles.wrapper}>
      {label ? (
        <div className={styles.labelRow}>
          <span>{label}</span>
          <span>{Math.round(porcentagem)}%</span>
        </div>
      ) : null}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={Math.round(porcentagem)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progresso'}
      >
        <div className={styles.fill} style={{ width: `${porcentagem}%` }} />
      </div>
    </div>
  )
}

export { ProgressBar }
