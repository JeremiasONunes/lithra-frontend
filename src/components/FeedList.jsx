import { ActivityCard } from './ActivityCard'
import styles from '../styles/components/FeedList.module.css'

/**
 * Lista de atividades do feed, resolvendo autor/livro de cada uma a partir de listas já carregadas
 * uma única vez pela página (`usuarios`/`livros`) — mesmo padrão de `ReviewList` (Etapa 12).
 * @param {{
 *   atividades: object[],
 *   usuarios?: object[],
 *   livros?: object[],
 *   usuarioAtualId: string,
 *   onCurtir: (atividade: object) => void,
 *   onComentar: (atividade: object) => void,
 * }} props
 */
function FeedList({ atividades, usuarios, livros, usuarioAtualId, onCurtir, onComentar }) {
  return (
    <ul className={styles.lista}>
      {atividades.map((atividade) => (
        <li key={atividade.id}>
          <ActivityCard
            atividade={atividade}
            autor={usuarios?.find((usuario) => usuario.id === atividade.usuarioId)}
            livro={livros?.find((livro) => livro.id === atividade.livroId)}
            curtidoPeloUsuarioAtual={!!atividade.curtidoPor?.includes(usuarioAtualId)}
            onCurtir={() => onCurtir(atividade)}
            onComentar={() => onComentar(atividade)}
          />
        </li>
      ))}
    </ul>
  )
}

export { FeedList }
