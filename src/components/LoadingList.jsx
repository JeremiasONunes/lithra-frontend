import { Skeleton } from './Skeleton'
import styles from '../styles/components/LoadingList.module.css'

/**
 * Lista de esqueletos (`Skeleton`, Etapa 4) com `role="status"` no contêiner — responsabilidade
 * que o próprio `Skeleton` documenta ser de quem o compõe em lista.
 * @param {{ count?: number, height?: string }} props
 */
function LoadingList({ count = 3, height = '72px' }) {
  return (
    <div className={styles.lista} role="status" aria-label="Carregando">
      {Array.from({ length: count }, (_, indice) => (
        <Skeleton key={indice} height={height} />
      ))}
    </div>
  )
}

export { LoadingList }
