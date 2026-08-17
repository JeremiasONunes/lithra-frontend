import { BookOpen, Star, UserX, Users } from 'lucide-react'

import { StatCard } from './StatCard'
import styles from '../styles/components/AdminDashboardStats.module.css'

/**
 * Grade de indicadores gerais da plataforma pro Dashboard Administrativo (#21) — 4 `StatCard`
 * (Etapa 6), mesmo padrão de grade já usado em `EstatisticasPage` (Etapa 17). "Contas Desativadas"
 * usa `tone="accent"` (não "primary"/"secondary" como os outros três) só pra diferenciar
 * visualmente um indicador de atenção/moderação dos indicadores de volume — não é um estado de
 * erro (por isso não usa `danger`, reservado a falha/ação destrutiva no resto do projeto).
 * @param {{ estatisticas: { totalLeitores: number, totalLivros: number, totalAvaliacoes: number, contasDesativadas: number } }} props
 */
function AdminDashboardStats({ estatisticas }) {
  return (
    <div className={styles.grade}>
      <StatCard label="Leitores" value={estatisticas.totalLeitores} icon={Users} tone="primary" />
      <StatCard
        label="Livros no catálogo"
        value={estatisticas.totalLivros}
        icon={BookOpen}
        tone="secondary"
      />
      <StatCard
        label="Avaliações na comunidade"
        value={estatisticas.totalAvaliacoes}
        icon={Star}
        tone="secondary"
      />
      <StatCard
        label="Contas desativadas"
        value={estatisticas.contasDesativadas}
        icon={UserX}
        tone="accent"
      />
    </div>
  )
}

export { AdminDashboardStats }
