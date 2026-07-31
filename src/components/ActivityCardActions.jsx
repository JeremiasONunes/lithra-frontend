import { Heart, MessageCircle } from 'lucide-react'

import styles from '../styles/components/ActivityCardActions.module.css'

/**
 * Curtir/comentar de uma atividade do feed. Curtir alterna (cada pessoa só tem uma curtida ativa
 * por vez — ver `atividadeDoFeedService.curtir`); `curtido` reflete o estado atual pro usuário
 * logado, com o coração preenchido e `aria-pressed` (mesmo padrão de toggle já usado em
 * `RatingStars`, Etapa 6). Comentar continua só incrementando um contador — a entidade
 * `AtividadeDoFeed` (Etapa 7) não guarda o conteúdo de cada comentário, só o total.
 * @param {{
 *   curtidas: number,
 *   comentarios: number,
 *   curtido: boolean,
 *   onCurtir: () => void,
 *   onComentar: () => void,
 * }} props
 */
function ActivityCardActions({ curtidas, comentarios, curtido, onCurtir, onComentar }) {
  return (
    <div className={styles.acoes}>
      <button
        type="button"
        className={`${styles.acao} ${curtido ? styles.curtido : ''}`}
        onClick={onCurtir}
        aria-pressed={curtido}
        aria-label={`${curtido ? 'Descurtir' : 'Curtir'}. ${curtidas} ${curtidas === 1 ? 'curtida' : 'curtidas'}`}
      >
        <Heart size={18} aria-hidden="true" fill={curtido ? 'currentColor' : 'none'} />
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
