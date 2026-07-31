import { Compass } from 'lucide-react'

import { BookSearchResults } from '../components/BookSearchResults'
import { PageHeader } from '../components/PageHeader'
import { PageStateBoundary } from '../components/PageStateBoundary'
import { useLivrosEmDestaque } from '../hooks/useLivrosEmDestaque'
import styles from '../styles/pages/DescobrirPage.module.css'

/**
 * Descobrir (#6) — livros em destaque, independente do grafo social do usuário.
 *
 * Sem `DiscoverGrid` como componente próprio: `BookSearchResults` (Etapa 12) já é exatamente essa
 * grade (capa/título/autor/nota, linkando pra Página do Livro) — criar um componente novo pra
 * reproduzir o mesmo JSX só duplicaria código sem nenhuma diferença visual real.
 */
function DescobrirPage() {
  const { dado: livros, carregando, erro, recarregar } = useLivrosEmDestaque()

  return (
    <div className={styles.wrapper}>
      <PageHeader title="Descobrir" />
      <PageStateBoundary
        carregando={carregando}
        erro={erro}
        recarregar={recarregar}
        vazio={!carregando && !erro && (livros?.length ?? 0) === 0}
        estadoVazio={{
          icon: Compass,
          title: 'Nenhum livro em destaque no momento',
          description: 'Volte mais tarde pra ver novas sugestões.',
        }}
      >
        <BookSearchResults resultados={livros ?? []} />
      </PageStateBoundary>
    </div>
  )
}

export { DescobrirPage }
