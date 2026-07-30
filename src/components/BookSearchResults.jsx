import { Link } from 'react-router-dom'

import { BookCoverThumb } from './BookCoverThumb'
import { RatingStars } from './RatingStars'
import styles from '../styles/components/BookSearchResults.module.css'

/** @param {{ resultados: object[] }} props */
function BookSearchResults({ resultados }) {
  return (
    <ul className={styles.grade}>
      {resultados.map((livro) => (
        <li key={livro.id}>
          <Link to={`/livros/${livro.id}`} className={styles.item}>
            <BookCoverThumb src={livro.capaUrl} title={livro.titulo} />
            <span className={styles.titulo}>{livro.titulo}</span>
            <span className={styles.autor}>{livro.autor}</span>
            <RatingStars value={livro.mediaAvaliacoes} size={14} />
          </Link>
        </li>
      ))}
    </ul>
  )
}

export { BookSearchResults }
