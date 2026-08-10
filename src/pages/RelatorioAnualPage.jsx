import { ChevronLeft, FileBarChart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { AnnualReportPreview } from '../components/AnnualReportPreview'
import { PageStateBoundary } from '../components/PageStateBoundary'
import { useAuth } from '../context/AuthContext'
import { useReadingStats } from '../hooks/useReadingStats'
import styles from '../styles/pages/RelatorioAnualPage.module.css'

/**
 * Relatório Anual de Leitura (#17) — mesma agregação de `EstatisticasPage` (`useReadingStats`), só
 * com apresentação diferente (`AnnualReportPreview`, com autor mais lido além dos 4 indicadores
 * mínimos) e a ação de exportar. Sem "— {ano}" fixo no título: a agregação é de todo o histórico do
 * usuário (ver `useReadingStats.js`), não de um ano específico — um título "Relatório Anual — 2026"
 * (por exemplo) numa base cujos livros lidos são de 2025 pareceria vazio à toa.
 */
function RelatorioAnualPage() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const { dado: estatisticas, carregando, erro, recarregar } = useReadingStats(usuario.id)

  return (
    <div className={styles.wrapper}>
      <button type="button" onClick={() => navigate(-1)} className={styles.voltar}>
        <ChevronLeft size={16} aria-hidden="true" />
        Voltar
      </button>
      <h1 className={styles.titulo}>Relatório Anual de Leitura</h1>
      <PageStateBoundary
        carregando={carregando}
        erro={erro}
        recarregar={recarregar}
        vazio={!carregando && !erro && estatisticas?.totalLivrosLidos === 0}
        estadoVazio={{
          icon: FileBarChart,
          title: 'Nada pra exportar ainda',
          description: 'Marque livros como lidos na sua estante pra gerar seu relatório.',
        }}
      >
        {estatisticas ? (
          <AnnualReportPreview estatisticas={estatisticas} onExportar={() => window.print()} />
        ) : null}
      </PageStateBoundary>
    </div>
  )
}

export { RelatorioAnualPage }
