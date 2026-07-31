import { ActivityCardActions } from './ActivityCardActions'
import { BookCoverThumb } from './BookCoverThumb'
import { Card } from './Card'
import { RatingStars } from './RatingStars'
import { ReadingProgressBar } from './ReadingProgressBar'
import { UserAvatar } from './UserAvatar'
import { useAvaliacao } from '../hooks/useAvaliacao'
import styles from '../styles/components/ActivityCard.module.css'

const formatadorRelativo = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })

/** "há X min/h/dias" a partir de uma data ISO — sem biblioteca nova, `Intl.RelativeTimeFormat` já
 * resolve isso nativamente no navegador. */
function formatarTempoRelativo(criadoEm) {
  const diffMinutos = Math.round((new Date(criadoEm).getTime() - Date.now()) / 60000)
  if (Math.abs(diffMinutos) < 60) {
    return formatadorRelativo.format(diffMinutos, 'minute')
  }
  const diffHoras = Math.round(diffMinutos / 60)
  if (Math.abs(diffHoras) < 24) {
    return formatadorRelativo.format(diffHoras, 'hour')
  }
  return formatadorRelativo.format(Math.round(diffHoras / 24), 'day')
}

/**
 * Um evento da timeline — conteúdo varia por `atividade.tipo` (avaliação, progresso, adição à
 * estante, post livre), reaproveitando `RatingStars`/`BookCoverThumb`/`ReadingProgressBar` já
 * existentes (Etapa 6). `autor`/`livro` já vêm resolvidos de quem chama (`FeedList`), mesmo padrão
 * de `ReviewList` (Etapa 12) resolvendo o autor de cada avaliação a partir de uma lista já
 * carregada — evita N buscas repetidas do mesmo usuário/livro.
 *
 * A avaliação em si (nota/resenha, só relevante pro tipo "avaliacao") é a exceção: cada atividade
 * desse tipo referencia uma avaliação diferente (`avaliacaoId`), sem sobreposição entre cards pra
 * aproveitar — por isso é buscada aqui dentro, via `useAvaliacao` (hook próprio, sem chamar
 * `avaliacaoService` direto).
 * @param {{
 *   atividade: object,
 *   autor?: { nome: string, fotoUrl?: string },
 *   livro?: object,
 *   curtidoPeloUsuarioAtual: boolean,
 *   onCurtir: () => void,
 *   onComentar: () => void,
 * }} props
 */
function ActivityCard({ atividade, autor, livro, curtidoPeloUsuarioAtual, onCurtir, onComentar }) {
  const { dado: avaliacao } = useAvaliacao(
    atividade.tipo === 'avaliacao' ? atividade.avaliacaoId : null,
  )

  return (
    <Card className={styles.card}>
      <div className={styles.cabecalho}>
        <UserAvatar name={autor?.nome ?? 'Usuário'} src={autor?.fotoUrl} size="sm" />
        <div className={styles.autorInfo}>
          <span className={styles.nome}>{autor?.nome ?? 'Usuário'}</span>
          <span className={styles.tempo}>{formatarTempoRelativo(atividade.criadoEm)}</span>
        </div>
      </div>

      {atividade.tipo === 'avaliacao' ? (
        <div className={styles.corpoComLivro}>
          <BookCoverThumb src={livro?.capaUrl} title={livro?.titulo ?? ''} size="sm" />
          <div className={styles.detalheLivro}>
            <p className={styles.descricao}>
              avaliou <strong>{livro?.titulo}</strong>
            </p>
            <RatingStars value={avaliacao?.nota ?? 0} size={16} />
            {avaliacao?.resenha ? <p className={styles.resenha}>{avaliacao.resenha}</p> : null}
          </div>
        </div>
      ) : null}

      {atividade.tipo === 'progresso' ? (
        <div className={styles.corpoComLivro}>
          <BookCoverThumb src={livro?.capaUrl} title={livro?.titulo ?? ''} size="sm" />
          <div className={styles.detalheLivro}>
            <p className={styles.descricao}>
              está lendo <strong>{livro?.titulo}</strong>
            </p>
            <ReadingProgressBar
              paginaAtual={atividade.paginaAtual}
              paginaTotal={atividade.totalPaginas}
            />
          </div>
        </div>
      ) : null}

      {atividade.tipo === 'adicao-estante' ? (
        <div className={styles.corpoComLivro}>
          <BookCoverThumb src={livro?.capaUrl} title={livro?.titulo ?? ''} size="sm" />
          <p className={styles.descricao}>
            adicionou <strong>{livro?.titulo}</strong> à estante
          </p>
        </div>
      ) : null}

      {atividade.tipo === 'post-livre' ? (
        <div className={styles.corpoPost}>
          <p className={styles.texto}>{atividade.texto}</p>
          {livro ? (
            <div className={styles.livroAnexado}>
              <BookCoverThumb src={livro.capaUrl} title={livro.titulo} size="sm" />
              <span className={styles.descricao}>{livro.titulo}</span>
            </div>
          ) : null}
          {atividade.fotoUrl ? (
            <img
              src={atividade.fotoUrl}
              alt={`Foto publicada por ${autor?.nome ?? 'usuário'}`}
              className={styles.fotoPost}
            />
          ) : null}
        </div>
      ) : null}

      <ActivityCardActions
        curtidas={atividade.curtidas}
        comentarios={atividade.comentarios}
        curtido={curtidoPeloUsuarioAtual}
        onCurtir={onCurtir}
        onComentar={onComentar}
      />
    </Card>
  )
}

export { ActivityCard }
