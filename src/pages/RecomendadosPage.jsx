import { Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { PageHeader } from '../components/PageHeader'
import { PageStateBoundary } from '../components/PageStateBoundary'
import { RecommendationCard } from '../components/RecommendationCard'
import { useAuth } from '../context/AuthContext'
import { useLivros } from '../hooks/useLivros'
import { useRecomendacoes } from '../hooks/useRecomendacoes'
import styles from '../styles/pages/RecomendadosPage.module.css'

/**
 * Recomendados para Você (#18) — cada item vem com `justificativa` (`recomendacaoService`, nunca
 * só a capa). `livros` (Etapa 13, lista completa) resolve o livro de cada recomendação — mesmo
 * padrão de join na página já usado em `FeedList`/`EstantePage` (junta duas listas já carregadas,
 * sem N buscas repetidas por item).
 */
function RecomendadosPage() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const { dado: recomendacoes, carregando, erro, recarregar } = useRecomendacoes(usuario.id)
  const { dado: livros } = useLivros()

  const recomendacoesComLivro = (recomendacoes ?? [])
    .map((recomendacao) => ({
      ...recomendacao,
      livro: livros?.find((livro) => livro.id === recomendacao.livroId),
    }))
    .filter((recomendacao) => recomendacao.livro)

  return (
    <div className={styles.wrapper}>
      <PageHeader title="Recomendados para Você" />
      <p className={styles.subtitulo}>
        <Sparkles size={14} aria-hidden="true" />
        Sugestões baseadas no que você gostou de ler
      </p>
      <PageStateBoundary
        carregando={carregando}
        erro={erro}
        recarregar={recarregar}
        vazio={!carregando && !erro && recomendacoesComLivro.length === 0}
        estadoVazio={{
          icon: Sparkles,
          title: 'Ainda sem recomendações',
          description: 'Avalie alguns livros pra receber sugestões personalizadas.',
          actionLabel: 'Buscar livro',
          onAction: () => navigate('/buscar-livro'),
        }}
      >
        <div className={styles.grade}>
          {recomendacoesComLivro.map((recomendacao) => (
            <RecommendationCard
              key={recomendacao.livroId}
              livro={recomendacao.livro}
              justificativa={recomendacao.justificativa}
            />
          ))}
        </div>
      </PageStateBoundary>
    </div>
  )
}

export { RecomendadosPage }
