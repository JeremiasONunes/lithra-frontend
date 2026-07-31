import { Link } from 'react-router-dom'

import { Badge } from './Badge'
import { BookCoverThumb } from './BookCoverThumb'
import { RatingStars } from './RatingStars'
import styles from '../styles/components/RecommendationCard.module.css'

/**
 * Um livro recomendado + a justificativa da sugestão — Critério de Aceite da Etapa 15:
 * "recomendações sempre vêm acompanhadas de uma justificativa textual, nunca só a capa do livro".
 * @param {{ livro: object, justificativa: string }} props
 */
function RecommendationCard({ livro, justificativa }) {
  return (
    <div className={styles.card}>
      <Link to={`/livros/${livro.id}`} className={styles.link}>
        <BookCoverThumb src={livro.capaUrl} title={livro.titulo} />
        <span className={styles.titulo}>{livro.titulo}</span>
        <span className={styles.autor}>{livro.autor}</span>
        <RatingStars value={livro.mediaAvaliacoes} size={14} />
      </Link>
      <Badge tone="accent" className={styles.justificativa}>
        {justificativa}
      </Badge>
    </div>
  )
}

export { RecommendationCard }
