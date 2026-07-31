import { useState } from 'react'
import { Compass } from 'lucide-react'

import { BookSearchResults } from '../components/BookSearchResults'
import { LoadingList } from '../components/LoadingList'
import { PageHeader } from '../components/PageHeader'
import { PageStateBoundary } from '../components/PageStateBoundary'
import { useLazyLoadGatilho } from '../hooks/useLazyLoadGatilho'
import { useLivrosEmDestaque } from '../hooks/useLivrosEmDestaque'
import styles from '../styles/pages/DescobrirPage.module.css'

/**
 * Descobrir (#6) — livros em destaque, independente do grafo social do usuário.
 *
 * Sem `DiscoverGrid` como componente próprio: `BookSearchResults` (Etapa 12) já é exatamente essa
 * grade (capa/título/autor/nota, linkando pra Página do Livro) — criar um componente novo pra
 * reproduzir o mesmo JSX só duplicaria código sem nenhuma diferença visual real.
 *
 * Lazy load reaproveitado do Feed (`useLazyLoadGatilho`, a pedido do responsável do projeto: "a
 * mesma função no buscar livro e no descobrir") — mesmo mecanismo, mesma paginação client-side de
 * `useFeed`/`useLivrosEmDestaque`.
 */
function DescobrirPage() {
  const [pagina, setPagina] = useState(1)
  const { dado, carregando, erro, recarregar } = useLivrosEmDestaque(pagina)

  const livros = dado?.itens ?? []
  const temMais = (dado?.total ?? 0) > livros.length

  const { indiceGatilho, onGatilhoRef } = useLazyLoadGatilho({
    temMais,
    quantidadeAtual: livros.length,
    carregando,
    aoCarregarMais: () => setPagina((atual) => atual + 1),
  })

  return (
    <div className={styles.wrapper}>
      <PageHeader title="Descobrir" />
      <PageStateBoundary
        carregando={carregando && livros.length === 0}
        erro={erro}
        recarregar={recarregar}
        vazio={!carregando && !erro && livros.length === 0}
        estadoVazio={{
          icon: Compass,
          title: 'Nenhum livro em destaque no momento',
          description: 'Volte mais tarde pra ver novas sugestões.',
        }}
      >
        <BookSearchResults
          resultados={livros}
          indiceGatilho={indiceGatilho}
          onGatilhoRef={onGatilhoRef}
        />
        {carregando && livros.length > 0 ? <LoadingList count={2} /> : null}
      </PageStateBoundary>
    </div>
  )
}

export { DescobrirPage }
