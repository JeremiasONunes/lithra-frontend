import { Link } from 'react-router-dom'

import { BookCoverThumb } from './BookCoverThumb'
import { RatingStars } from './RatingStars'
import styles from '../styles/components/BookSearchResults.module.css'

/**
 * `indiceGatilho`/`onGatilhoRef` (lazy load, opcional): mesmo padrão de `FeedList` (Etapa 14) — o
 * item nessa posição recebe a ref que `useLazyLoadGatilho` observa. Default `-1`/`undefined` não
 * afeta quem não usa lazy load (`BuscaPage`, Etapa 15, mostra os resultados inteiros de uma vez).
 * @param {{
 *   resultados: object[],
 *   indiceGatilho?: number,
 *   onGatilhoRef?: (elemento: HTMLElement | null) => void,
 * }} props
 */
function BookSearchResults({ resultados, indiceGatilho = -1, onGatilhoRef }) {
  return (
    <ul className={styles.grade}>
      {resultados.map((livro, indice) => (
        <li key={livro.id} ref={indice === indiceGatilho ? onGatilhoRef : undefined}>
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
