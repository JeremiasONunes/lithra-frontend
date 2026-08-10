import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { PageStateBoundary } from '../components/PageStateBoundary'
import { ReadingGoalCircularProgress } from '../components/ReadingGoalCircularProgress'
import { ReadingGoalForm } from '../components/ReadingGoalForm'
import { useAuth } from '../context/AuthContext'
import { useMetaDeLeitura } from '../hooks/useMetaDeLeitura'
import { useReadingStats } from '../hooks/useReadingStats'
import styles from '../styles/pages/MetaLeituraPage.module.css'

/**
 * Meta de Leitura (#19) — `ano` vem de `useReadingStats().anoReferencia` (ano mais recente com
 * livro lido no histórico do usuário; ver `useReadingStats.js`), não de `new Date().getFullYear()`
 * puro — garante que `usuario-1`/`usuario-2`/`usuario-4` (que já têm meta cadastrada pra 2025, ver
 * `metaDeLeituraService.js`) continuam encontrando a própria meta independente de em que ano real o
 * projeto for aberto. `null` enquanto `anoReferencia` ainda não resolveu — `useMetaDeLeitura` trata
 * isso sem lançar erro.
 *
 * Critério de Aceite "atualizar reflete imediatamente no progresso circular": `recarregarMeta`
 * (chamado por `ReadingGoalForm` ao salvar) atualiza `meta`, que já é a prop que
 * `ReadingGoalCircularProgress` usa — sem lógica extra, é o próprio fluxo de dado padrão do projeto
 * (hook de leitura + `recarregar()` na mutation).
 */
function MetaLeituraPage() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const {
    dado: estatisticas,
    carregando: carregandoEstatisticas,
    erro: erroEstatisticas,
    recarregar: recarregarEstatisticas,
  } = useReadingStats(usuario.id)

  const ano = estatisticas?.anoReferencia ?? null
  const {
    dado: meta,
    carregando: carregandoMeta,
    erro: erroMeta,
    recarregar: recarregarMeta,
  } = useMetaDeLeitura(usuario.id, ano)

  const carregando = carregandoEstatisticas || (ano !== null && carregandoMeta)
  const erro = erroEstatisticas || erroMeta

  return (
    <div className={styles.wrapper}>
      <button type="button" onClick={() => navigate(-1)} className={styles.voltar}>
        <ChevronLeft size={16} aria-hidden="true" />
        Voltar
      </button>
      <h1 className={styles.titulo}>Meta de Leitura</h1>
      <PageStateBoundary
        carregando={carregando}
        erro={erro}
        recarregar={() => {
          recarregarEstatisticas()
          recarregarMeta()
        }}
      >
        {estatisticas ? (
          <div className={styles.conteudo}>
            <ReadingGoalCircularProgress
              atual={estatisticas.livrosLidosNoAnoReferencia}
              meta={meta?.metaLivros ?? 0}
            />
            <ReadingGoalForm
              usuarioId={usuario.id}
              ano={estatisticas.anoReferencia}
              metaExistente={meta}
              onSalvo={recarregarMeta}
            />
          </div>
        ) : null}
      </PageStateBoundary>
    </div>
  )
}

export { MetaLeituraPage }
