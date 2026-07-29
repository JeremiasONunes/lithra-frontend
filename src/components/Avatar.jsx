import styles from '../styles/components/Avatar.module.css'

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join('')
}

/** `name` é obrigatório mesmo sem foto — vira `alt` da imagem ou `aria-label` do fallback de
 * iniciais, nunca fica sem descrição acessível. */
function Avatar({ name, src, size = 'md' }) {
  return (
    <div className={`${styles.avatar} ${styles[size]}`}>
      {src ? (
        <img src={src} alt={name} className={styles.image} />
      ) : (
        <span role="img" aria-label={name} className={styles.initials}>
          {getInitials(name)}
        </span>
      )}
    </div>
  )
}

export { Avatar }
