import { ActivityCard } from './ActivityCard'
import styles from '../styles/components/FeedList.module.css'

/**
 * Lista de atividades do feed, resolvendo autor/livro de cada uma a partir de listas já carregadas
 * uma única vez pela página (`usuarios`/`livros`) — mesmo padrão de `ReviewList` (Etapa 12).
 * `usuarios` também é repassado inteiro pra cada `ActivityCard` resolver o autor de cada comentário
 * (não só o da própria atividade).
 * @param {{
 *   atividades: object[],
 *   usuarios?: object[],
 *   livros?: object[],
 *   usuarioAtualId: string,
 *   onCurtir: (atividade: object) => void,
 * }} props
 */
function FeedList({ atividades, usuarios, livros, usuarioAtualId, onCurtir }) {
  return (
    <ul className={styles.lista}>
      {atividades.map((atividade) => (
        <li key={atividade.id}>
          <ActivityCard
            atividade={atividade}
            autor={usuarios?.find((usuario) => usuario.id === atividade.usuarioId)}
            livro={livros?.find((livro) => livro.id === atividade.livroId)}
            usuarios={usuarios}
            curtidoPeloUsuarioAtual={!!atividade.curtidoPor?.includes(usuarioAtualId)}
            onCurtir={() => onCurtir(atividade)}
          />
        </li>
      ))}
    </ul>
  )
}

export { FeedList }
