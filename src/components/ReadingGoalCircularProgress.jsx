import styles from '../styles/components/ReadingGoalCircularProgress.module.css'

const RAIO = 54
const CIRCUNFERENCIA = 2 * Math.PI * RAIO

/**
 * Progresso circular da Meta de Leitura — componente novo (não reaproveita `ProgressBar`, Etapa 4,
 * que é linear; a Descrição da Etapa 17 pede "progresso circular" explicitamente). Anel via SVG
 * puro (`stroke-dasharray`/`stroke-dashoffset`), sem biblioteca — mesma decisão de "sem lib de
 * gráfico" já registrada nesta etapa pra `ReadingStatsCharts`.
 * @param {{ atual: number, meta: number }} props
 */
function ReadingGoalCircularProgress({ atual, meta }) {
  const fracao = meta > 0 ? Math.min(1, atual / meta) : 0
  const offset = CIRCUNFERENCIA * (1 - fracao)
  const atingida = meta > 0 && atual >= meta

  return (
    <div className={styles.wrapper}>
      <svg
        viewBox="0 0 120 120"
        className={styles.svg}
        role="img"
        aria-label={`${atual} de ${meta} livros lidos, ${Math.round(fracao * 100)}% da meta${atingida ? ', meta atingida' : ''}`}
      >
        <circle cx="60" cy="60" r={RAIO} strokeWidth="12" className={styles.trilha} fill="none" />
        <circle
          cx="60"
          cy="60"
          r={RAIO}
          strokeWidth="12"
          fill="none"
          className={`${styles.progresso} ${atingida ? styles.atingida : ''}`}
          strokeDasharray={CIRCUNFERENCIA}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className={styles.texto} aria-hidden="true">
        <span className={styles.numero}>{atual}</span>
        <span className={styles.deTotal}>de {meta}</span>
      </div>
    </div>
  )
}

export { ReadingGoalCircularProgress }
