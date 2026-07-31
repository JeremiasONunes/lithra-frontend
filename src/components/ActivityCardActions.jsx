import { Heart, MessageCircle } from 'lucide-react'

import styles from '../styles/components/ActivityCardActions.module.css'

/**
 * Curtir/comentar de uma atividade do feed. Curtir alterna (cada pessoa só tem uma curtida ativa
 * por vez — ver `atividadeDoFeedService.curtir`); `curtido` reflete o estado atual pro usuário
 * logado, com o coração preenchido e `aria-pressed` (mesmo padrão de toggle já usado em
 * `RatingStars`, Etapa 6). Comentar abre/fecha o painel de comentários (`ActivityComments`, em
 * `ActivityCard`) — `comentariosAbertos` controla o rótulo/`aria-expanded`, o próprio botão não
 * publica nada.
 * @param {{
 *   curtidas: number,
 *   comentarios: number,
 *   curtido: boolean,
 *   comentariosAbertos: boolean,
 *   onCurtir: () => void,
 *   onComentar: () => void,
 * }} props
 */
function ActivityCardActions({
  curtidas,
  comentarios,
  curtido,
  comentariosAbertos,
  onCurtir,
  onComentar,
}) {
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
        className={`${styles.acao} ${comentariosAbertos ? styles.ativo : ''}`}
        onClick={onComentar}
        aria-expanded={comentariosAbertos}
        aria-label={`${comentariosAbertos ? 'Fechar comentários' : 'Comentar'}. ${comentarios} ${comentarios === 1 ? 'comentário' : 'comentários'}`}
      >
        <MessageCircle size={18} aria-hidden="true" />
        <span aria-hidden="true">{comentarios}</span>
      </button>
    </div>
  )
}

export { ActivityCardActions }
