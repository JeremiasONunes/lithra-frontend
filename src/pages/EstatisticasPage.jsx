import { BookOpen, FileText, Tag } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { GenreBreakdown } from '../components/GenreBreakdown'
import { PageHeader } from '../components/PageHeader'
import { PageStateBoundary } from '../components/PageStateBoundary'
import { ReadingStatsCharts } from '../components/ReadingStatsCharts'
import { StatCard } from '../components/StatCard'
import { useAuth } from '../context/AuthContext'
import { useReadingStats } from '../hooks/useReadingStats'
import styles from '../styles/pages/EstatisticasPage.module.css'

/**
 * Minhas Estatísticas de Leitura (#16) — os 4 indicadores citados no briefing (ver
 * `livu - pivotado/briefing-viabilidade.md`, Seção 3, UC2 Ind.5): livros lidos, gênero favorito,
 * páginas totais (3 `StatCard`, Etapa 6) e livros lidos por mês (`ReadingStatsCharts`).
 * `GenreBreakdown` vai além do mínimo (distribuição completa, não só o favorito) — componente
 * próprio da etapa, não fica de fora.
 */
function EstatisticasPage() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const { dado: estatisticas, carregando, erro, recarregar } = useReadingStats(usuario.id)

  return (
    <div className={styles.wrapper}>
      <PageHeader title="Minhas Estatísticas" />
      <PageStateBoundary
        carregando={carregando}
        erro={erro}
        recarregar={recarregar}
        vazio={!carregando && !erro && estatisticas?.totalLivrosLidos === 0}
        estadoVazio={{
          icon: BookOpen,
          title: 'Nenhum livro lido ainda',
          description: 'Marque livros como lidos na sua estante pra ver suas estatísticas aqui.',
          actionLabel: 'Buscar livro',
          onAction: () => navigate('/buscar-livro'),
        }}
      >
        {estatisticas ? (
          <div className={styles.conteudo}>
            <div className={styles.tiles}>
              <StatCard
                label="Livros lidos"
                value={estatisticas.totalLivrosLidos}
                icon={BookOpen}
                tone="primary"
              />
              <StatCard
                label="Páginas lidas"
                value={estatisticas.totalPaginasLidas}
                icon={FileText}
                tone="secondary"
              />
              <StatCard
                label="Gênero favorito"
                value={estatisticas.generoFavorito ?? '—'}
                icon={Tag}
                tone="accent"
              />
            </div>
            <ReadingStatsCharts livrosPorMes={estatisticas.livrosPorMes} />
            <GenreBreakdown
              distribucaoPorGenero={estatisticas.distribucaoPorGenero}
              total={estatisticas.totalLivrosLidos}
            />
            <div className={styles.links}>
              <Link to="/estatisticas/relatorio-anual">Ver Relatório Anual</Link>
              <Link to="/meta-leitura">Ver Meta de Leitura</Link>
            </div>
          </div>
        ) : null}
      </PageStateBoundary>
    </div>
  )
}

export { EstatisticasPage }
