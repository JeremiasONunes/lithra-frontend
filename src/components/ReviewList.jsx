import { ReviewCard } from './ReviewCard'
import styles from '../styles/components/ReviewList.module.css'

/**
 * Lista as avaliações de um livro, resolvendo o autor de cada uma a partir de `usuarios` (a
 * própria página busca a lista de usuários uma única vez, em vez de cada `ReviewCard` fazer sua
 * própria leitura — evita N chamadas repetidas pro mesmo dado).
 * @param {{
 *   avaliacoes: object[],
 *   usuarios?: object[],
 *   usuarioAtualId: string,
 *   onEditar: (avaliacao: object) => void,
 *   onExcluir: (avaliacao: object) => void,
 * }} props
 */
function ReviewList({ avaliacoes, usuarios, usuarioAtualId, onEditar, onExcluir }) {
  return (
    <ul className={styles.lista}>
      {avaliacoes.map((avaliacao) => (
        <li key={avaliacao.id}>
          <ReviewCard
            avaliacao={avaliacao}
            autor={usuarios?.find((usuario) => usuario.id === avaliacao.usuarioId)}
            podeEditar={avaliacao.usuarioId === usuarioAtualId}
            onEditar={() => onEditar(avaliacao)}
            onExcluir={() => onExcluir(avaliacao)}
          />
        </li>
      ))}
    </ul>
  )
}

export { ReviewList }
