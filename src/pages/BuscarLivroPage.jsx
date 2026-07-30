import { useState } from 'react'
import { BookX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { BookSearchBar } from '../components/BookSearchBar'
import { BookSearchResults } from '../components/BookSearchResults'
import { EmptyState } from '../components/EmptyState'
import { ManualBookForm } from '../components/ManualBookForm'
import { PageHeader } from '../components/PageHeader'
import { PageStateBoundary } from '../components/PageStateBoundary'
import { useBuscaDeLivros } from '../hooks/useBuscaDeLivros'
import styles from '../styles/pages/BuscarLivroPage.module.css'

/**
 * Buscar/Cadastrar Livro (#12). `query` (o que está no campo) e `termoBuscado` (o que de fato
 * dispara `useBuscaDeLivros`) são estados separados de propósito — a busca só acontece na
 * submissão do formulário, não a cada tecla digitada.
 *
 * Sem resultado, o formulário de cadastro manual não aparece direto — primeiro mostra um
 * `EmptyState` centralizado com a pergunta "Deseja cadastrar livro?"; o formulário só aparece
 * depois desse clique, dando a chance de tentar outro termo de busca antes de partir pro cadastro.
 */
function BuscarLivroPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [termoBuscado, setTermoBuscado] = useState(null)
  const [mostrarCadastro, setMostrarCadastro] = useState(false)

  const { dado: resultados, carregando, erro, recarregar } = useBuscaDeLivros(termoBuscado ?? '')

  function aoBuscar(evento) {
    evento.preventDefault()
    const termo = query.trim()
    if (!termo) return
    setMostrarCadastro(false)
    setTermoBuscado(termo)
  }

  const naoEncontrouNada = termoBuscado !== null && !carregando && !erro && resultados?.length === 0

  return (
    <div className={styles.wrapper}>
      <PageHeader title="Buscar livro" />
      <BookSearchBar value={query} onChange={setQuery} onSubmit={aoBuscar} />
      {termoBuscado !== null ? (
        <PageStateBoundary carregando={carregando} erro={erro} recarregar={recarregar}>
          {naoEncontrouNada ? (
            <div className={styles.semResultado}>
              {mostrarCadastro ? (
                <ManualBookForm
                  tituloInicial={termoBuscado}
                  onCadastrado={(livro) => navigate(`/livros/${livro.id}`)}
                />
              ) : (
                <EmptyState
                  icon={BookX}
                  title="Nenhum livro encontrado"
                  description="Não encontramos nenhum livro com esse termo."
                  actionLabel="Deseja cadastrar livro?"
                  onAction={() => setMostrarCadastro(true)}
                />
              )}
            </div>
          ) : (
            <BookSearchResults resultados={resultados ?? []} />
          )}
        </PageStateBoundary>
      ) : null}
    </div>
  )
}

export { BuscarLivroPage }
