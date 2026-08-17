import { useState } from 'react'
import { BookOpen } from 'lucide-react'

import { CatalogManagementTable } from '../components/CatalogManagementTable'
import { MergeDuplicatesDialog } from '../components/MergeDuplicatesDialog'
import { PageHeader } from '../components/PageHeader'
import { PageStateBoundary } from '../components/PageStateBoundary'
import { useCatalogoAdmin } from '../hooks/useCatalogoAdmin'
import styles from '../styles/pages/AdminCatalogPage.module.css'

/**
 * Gestão de Catálogo (#22) — lista de livros com ação de mesclar duplicados. `livroParaMesclar`
 * guarda o "principal" escolhido (botão "Mesclar com..." de uma linha); o diálogo lista o resto do
 * catálogo como candidato a duplicado. Ao mesclar, `recarregar()` do `useCatalogoAdmin` atualiza a
 * lista sem reload manual — mesmo padrão de mutation + `recarregar()` do resto do projeto.
 */
function AdminCatalogPage() {
  const { dado: livros, carregando, erro, recarregar } = useCatalogoAdmin()
  const [livroParaMesclar, setLivroParaMesclar] = useState(null)

  return (
    <div className={styles.wrapper}>
      <PageHeader title="Gestão de catálogo" />
      <PageStateBoundary
        carregando={carregando}
        erro={erro}
        recarregar={recarregar}
        vazio={!carregando && !erro && livros?.length === 0}
        estadoVazio={{
          icon: BookOpen,
          title: 'Nenhum livro no catálogo',
          description: 'Os livros cadastrados pelos leitores aparecem aqui.',
        }}
      >
        <CatalogManagementTable livros={livros ?? []} onMesclar={setLivroParaMesclar} />
      </PageStateBoundary>
      <MergeDuplicatesDialog
        open={!!livroParaMesclar}
        onClose={() => setLivroParaMesclar(null)}
        livroPrincipal={livroParaMesclar}
        livros={livros ?? []}
        onMesclado={recarregar}
      />
    </div>
  )
}

export { AdminCatalogPage }
