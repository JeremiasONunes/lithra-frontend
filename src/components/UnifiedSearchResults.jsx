import { Badge } from './Badge'
import { BookSearchResults } from './BookSearchResults'
import { FollowList } from './FollowList'
import styles from '../styles/components/UnifiedSearchResults.module.css'

/**
 * Seções separadas Livros/Leitores (Critério de Aceite da Etapa 15) — livros reaproveita
 * `BookSearchResults` (Etapa 12) direto, mesma grade de capas, sem duplicar; leitores reaproveita
 * `FollowList` (Etapa 16 — "FollowButton compartilhado entre Perfil, Busca e Seguidores/Seguindo",
 * exigência explícita do Checklist Técnico da Etapa 16). Quando a Busca foi construída (Etapa 15),
 * `FollowButton` ainda não existia; a lista de leitores era local a este componente, sem ação —
 * extraída pra `FollowList` agora que a Etapa 16 chegou.
 *
 * Cada seção só aparece se tiver resultado; o estado "nada em nenhuma das duas" é responsabilidade
 * de quem chama (`BuscaPage`, via `PageStateBoundary`), não deste componente.
 * @param {{ livros: object[], leitores: object[], usuarioAtualId: string }} props
 */
function UnifiedSearchResults({ livros, leitores, usuarioAtualId }) {
  return (
    <div className={styles.wrapper}>
      {livros.length > 0 ? (
        <section className={styles.secao}>
          <Badge tone="secondary">Livros</Badge>
          <BookSearchResults resultados={livros} />
        </section>
      ) : null}

      {leitores.length > 0 ? (
        <section className={styles.secao}>
          <Badge tone="primary">Leitores</Badge>
          <FollowList usuarios={leitores} usuarioAtualId={usuarioAtualId} />
        </section>
      ) : null}
    </div>
  )
}

export { UnifiedSearchResults }
