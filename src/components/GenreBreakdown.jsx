import { Card } from './Card'
import { ProgressBar } from './ProgressBar'
import styles from '../styles/components/GenreBreakdown.module.css'

/**
 * Distribuição de livros lidos por gênero — reaproveita `ProgressBar` (Etapa 4) por linha, uma pra
 * cada gênero (`value` = quantidade daquele gênero, `max` = total lido), em vez de um componente de
 * barra novo — mesmo raciocínio já usado em Descobrir (Etapa 15) pra `BookSearchResults`.
 * @param {{ distribucaoPorGenero: { genero: string, quantidade: number }[], total: number }} props
 */
function GenreBreakdown({ distribucaoPorGenero, total }) {
  return (
    <Card className={styles.card}>
      <h2 className={styles.titulo}>Por gênero</h2>
      <ul className={styles.lista}>
        {distribucaoPorGenero.map((linha) => (
          <li key={linha.genero}>
            <ProgressBar
              label={`${linha.genero} (${linha.quantidade})`}
              value={linha.quantidade}
              max={total}
            />
          </li>
        ))}
      </ul>
    </Card>
  )
}

export { GenreBreakdown }
