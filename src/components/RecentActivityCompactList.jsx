import { ActivityCard } from './ActivityCard'
import { Card } from './Card'
import { EmptyState } from './EmptyState'
import { Activity } from 'lucide-react'
import styles from '../styles/components/RecentActivityCompactList.module.css'

/**
 * Atividade recente da plataforma inteira, pro Dashboard Administrativo (#21) — `ActivityCard`
 * (Etapa 14) em modo `compacto` (novo prop desta etapa), um `Card` (Etapa 4) só envolvendo a lista
 * inteira (não um por linha, diferente do Feed) pra não duplicar sombra/borda a cada item.
 * `autor`/`livro` de cada atividade são resolvidos aqui, mesmo padrão de `FeedList` (Etapa 14) —
 * `usuarios`/`livros` já vêm carregados de `AdminDashboardPage` (`useUsuariosAdmin`/
 * `useCatalogoAdmin`), sem busca individual por atividade.
 * @param {{ atividades: object[], usuarios: object[], livros: object[] }} props
 */
function RecentActivityCompactList({ atividades, usuarios, livros }) {
  if (atividades.length === 0) {
    return (
      <Card className={styles.card}>
        <EmptyState
          icon={Activity}
          title="Nenhuma atividade ainda"
          description="Assim que os leitores começarem a usar o Lythra, a atividade recente aparece aqui."
        />
      </Card>
    )
  }

  return (
    <Card className={styles.card}>
      <h2 className={styles.titulo}>Atividade recente</h2>
      <div className={styles.lista}>
        {atividades.map((atividade) => (
          <ActivityCard
            key={atividade.id}
            atividade={atividade}
            autor={usuarios.find((usuario) => usuario.id === atividade.usuarioId)}
            livro={livros.find((livro) => livro.id === atividade.livroId)}
            compacto
          />
        ))}
      </div>
    </Card>
  )
}

export { RecentActivityCompactList }
