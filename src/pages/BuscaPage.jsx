import { useState } from 'react'
import { Search } from 'lucide-react'

import { BookSearchBar } from '../components/BookSearchBar'
import { PageHeader } from '../components/PageHeader'
import { PageStateBoundary } from '../components/PageStateBoundary'
import { UnifiedSearchResults } from '../components/UnifiedSearchResults'
import { useAuth } from '../context/AuthContext'
import { useBuscaUnificada } from '../hooks/useBuscaUnificada'
import styles from '../styles/pages/BuscaPage.module.css'

/**
 * Busca (#7) — livros e leitores no mesmo campo, resultados em seções separadas (Critério de
 * Aceite da Etapa 15). `BookSearchBar` (Etapa 12) reaproveitado com `placeholder` próprio.
 *
 * `termoBuscado` começa em `''` e só busca quando não vazio — diferente de `/buscar-livro` (Etapa
 * 12, ajustada depois pra mostrar o catálogo inteiro em campo vazio): aqui, campo vazio mostrando
 * o catálogo inteiro MAIS todos os leitores de uma vez seria barulho demais numa busca unificada;
 * ver `useBuscaUnificada`. Limpar o campo volta pro estado neutro (nenhuma seção visível), mesmo
 * padrão de "campo vazio reseta a busca na hora" já usado em `/buscar-livro`.
 */
function BuscaPage() {
  const { usuario } = useAuth()
  const [query, setQuery] = useState('')
  const [termoBuscado, setTermoBuscado] = useState('')

  const { dado, carregando, erro, recarregar } = useBuscaUnificada(termoBuscado)

  function aoMudarQuery(valor) {
    setQuery(valor)
    if (valor.trim() === '') {
      setTermoBuscado('')
    }
  }

  function aoBuscar(evento) {
    evento.preventDefault()
    setTermoBuscado(query.trim())
  }

  const livros = dado?.livros ?? []
  const leitores = dado?.leitores ?? []
  const semResultado = !carregando && !erro && livros.length === 0 && leitores.length === 0

  return (
    <div className={styles.wrapper}>
      <PageHeader title="Busca" />
      <BookSearchBar
        value={query}
        onChange={aoMudarQuery}
        onSubmit={aoBuscar}
        placeholder="Buscar livros e leitores"
      />
      {termoBuscado ? (
        <PageStateBoundary
          carregando={carregando}
          erro={erro}
          recarregar={recarregar}
          vazio={semResultado}
          estadoVazio={{
            icon: Search,
            title: 'Nenhum resultado encontrado',
            description: 'Tente buscar por outro termo.',
          }}
        >
          <UnifiedSearchResults livros={livros} leitores={leitores} usuarioAtualId={usuario.id} />
        </PageStateBoundary>
      ) : null}
    </div>
  )
}

export { BuscaPage }
