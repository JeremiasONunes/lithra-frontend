import styles from '../styles/components/BookSynopsis.module.css'

/** @param {{ sinopse: string }} props */
function BookSynopsis({ sinopse }) {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.titulo}>Sinopse</h2>
      <p className={styles.texto}>{sinopse}</p>
    </section>
  )
}

export { BookSynopsis }
