import { BookCoverThumb } from './BookCoverThumb'
import { Badge } from './Badge'
import { Button } from './Button'
import { RatingStars } from './RatingStars'
import styles from '../styles/components/BookDetailHeader.module.css'

/**
 * Capa + título + autor + gênero + média da comunidade + ações, no topo da Página do Livro.
 * "Adicionar à Estante" fica desabilitado — a ação em si (gravar em `itemDaEstanteService`) é
 * funcionalidade da Etapa 13; aqui só o botão já existe, no lugar certo, como o roadmap desta etapa
 * descreve ("a ação existe aqui; a tela de gestão da estante é da Etapa 13").
 * @param {{
 *   livro: object,
 *   jaAvaliou: boolean,
 *   onAvaliar: () => void,
 * }} props
 */
function BookDetailHeader({ livro, jaAvaliou, onAvaliar }) {
  return (
    <div className={styles.wrapper}>
      <BookCoverThumb src={livro.capaUrl} title={livro.titulo} size="lg" />
      <div className={styles.info}>
        <h1 className={styles.titulo}>{livro.titulo}</h1>
        <p className={styles.autor}>{livro.autor}</p>
        <Badge tone="secondary">{livro.genero}</Badge>
        <div className={styles.avaliacao}>
          <RatingStars value={livro.mediaAvaliacoes} />
          <span className={styles.totalAvaliacoes}>
            {livro.mediaAvaliacoes.toFixed(1)} ({livro.totalAvaliacoes}{' '}
            {livro.totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'})
          </span>
        </div>
        <div className={styles.acoes}>
          <Button variant="primary" disabled>
            Adicionar à Estante
          </Button>
          <Button variant="ghost" onClick={onAvaliar}>
            {/* "Editar minha avaliação", não só "Editar avaliação" — evita nome acessível igual ao
             * botão de editar dentro de cada `ReviewCard` (ambíguo pra quem navega por leitor de
             * tela: dois botões com o mesmo nome, ações diferentes). */}
            {jaAvaliou ? 'Editar minha avaliação' : 'Avaliar'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { BookDetailHeader }
