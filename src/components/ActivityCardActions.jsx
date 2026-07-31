import { Heart, MessageCircle } from 'lucide-react'

import styles from '../styles/components/ActivityCardActions.module.css'

/**
 * Curtir/comentar de uma atividade do feed — mock só incrementa contadores (`curtidas`/
 * `comentarios`); a entidade `AtividadeDoFeed` (Etapa 7) não guarda quem curtiu nem o conteúdo de
 * cada comentário, só os dois totais, então não há "descurtir" nem lista de comentários aqui.
 * @param {{
 *   curtidas: number,
 *   comentarios: number,
 *   onCurtir: () => void,
 *   onComentar: () => void,
 * }} props
 */
function ActivityCardActions({ curtidas, comentarios, onCurtir, onComentar }) {
  return (
    <div className={styles.acoes}>
      <button
        type="button"
        className={styles.acao}
        onClick={onCurtir}
        aria-label={`Curtir. ${curtidas} ${curtidas === 1 ? 'curtida' : 'curtidas'}`}
      >
        <Heart size={18} aria-hidden="true" />
        <span aria-hidden="true">{curtidas}</span>
      </button>
      <button
        type="button"
        className={styles.acao}
        onClick={onComentar}
        aria-label={`Comentar. ${comentarios} ${comentarios === 1 ? 'comentário' : 'comentários'}`}
      >
        <MessageCircle size={18} aria-hidden="true" />
        <span aria-hidden="true">{comentarios}</span>
      </button>
    </div>
  )
}

export { ActivityCardActions }
