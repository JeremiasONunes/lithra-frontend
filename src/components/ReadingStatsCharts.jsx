import { Card } from './Card'
import styles from '../styles/components/ReadingStatsCharts.module.css'

/**
 * Livros lidos por mês — barras hand-rolled em CSS, mesma técnica da tela de referência do
 * `Lythra Design System` (`Stats.jsx`: altura de cada barra proporcional à maior contagem do
 * conjunto), sem nenhuma biblioteca de gráfico — decisão desta etapa, ver Histórico de Revisão.
 * @param {{ livrosPorMes: { mes: string, quantidade: number }[] }} props
 */
function ReadingStatsCharts({ livrosPorMes }) {
  const maiorQuantidade = Math.max(1, ...livrosPorMes.map((mes) => mes.quantidade))

  return (
    <Card className={styles.card}>
      <h2 className={styles.titulo}>Livros por mês</h2>
      <div className={styles.grafico} role="img" aria-label="Gráfico de livros lidos por mês">
        {livrosPorMes.map((mes) => (
          <div key={mes.mes} className={styles.coluna}>
            <span className={styles.quantidade}>{mes.quantidade > 0 ? mes.quantidade : ''}</span>
            <div
              className={styles.barra}
              style={{ height: `${(mes.quantidade / maiorQuantidade) * 100}%` }}
            />
            <span className={styles.mes}>{mes.mes}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export { ReadingStatsCharts }
