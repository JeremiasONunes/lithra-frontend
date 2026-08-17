import { AdminDashboardStats } from '../components/AdminDashboardStats'
import { PageHeader } from '../components/PageHeader'
import { PageStateBoundary } from '../components/PageStateBoundary'
import { RecentActivityCompactList } from '../components/RecentActivityCompactList'
import { useAdminStats } from '../hooks/useAdminStats'
import { useCatalogoAdmin } from '../hooks/useCatalogoAdmin'
import { useUsuariosAdmin } from '../hooks/useUsuariosAdmin'
import styles from '../styles/pages/AdminDashboardPage.module.css'

/**
 * Dashboard Administrativo (#21) — indicadores gerais (`AdminDashboardStats`, `StatCard` da Etapa
 * 6) + atividade recente da plataforma inteira (`RecentActivityCompactList`, `ActivityCard` em modo
 * compacto, Etapa 14 estendida). `usuarios`/`livros` são buscados aqui só pra resolver autor/livro
 * de cada atividade recente — mesmo padrão de join na página já usado em `FeedList`/`BookPage`
 * (Etapa 12), não dentro do hook de agregação.
 */
function AdminDashboardPage() {
  const { dado: estatisticas, carregando, erro, recarregar } = useAdminStats()
  const { dado: usuarios } = useUsuariosAdmin()
  const { dado: livros } = useCatalogoAdmin()

  return (
    <div className={styles.wrapper}>
      <PageHeader title="Painel administrativo" />
      <PageStateBoundary carregando={carregando} erro={erro} recarregar={recarregar}>
        {estatisticas ? (
          <div className={styles.conteudo}>
            <AdminDashboardStats estatisticas={estatisticas} />
            <RecentActivityCompactList
              atividades={estatisticas.atividadesRecentes}
              usuarios={usuarios ?? []}
              livros={livros ?? []}
            />
          </div>
        ) : null}
      </PageStateBoundary>
    </div>
  )
}

export { AdminDashboardPage }
