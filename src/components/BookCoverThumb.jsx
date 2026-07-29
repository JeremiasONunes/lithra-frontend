import { BookOpen } from 'lucide-react'

import styles from '../styles/components/BookCoverThumb.module.css'

/**
 * Capa de livro em proporção fixa (9:11, mesma proporção do `BookCard` de referência do Design
 * System), com fallback para livro sem capa cadastrada.
 * @param {{ src?: string, title: string, size?: 'sm' | 'md' | 'lg' }} props
 */
function BookCoverThumb({ src, title, size = 'md' }) {
  return (
    <div className={`${styles.thumb} ${styles[size]}`}>
      {src ? (
        <img src={src} alt={title} className={styles.image} />
      ) : (
        <span role="img" aria-label={title} className={styles.fallback}>
          <BookOpen aria-hidden="true" />
        </span>
      )}
    </div>
  )
}

export { BookCoverThumb }
