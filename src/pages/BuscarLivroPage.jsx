import { useState } from 'react'
import { BookX, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { BookSearchBar } from '../components/BookSearchBar'
import { BookSearchResults } from '../components/BookSearchResults'
import { EmptyState } from '../components/EmptyState'
import { LoadingList } from '../components/LoadingList'
import { ManualBookForm } from '../components/ManualBookForm'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { PageStateBoundary } from '../components/PageStateBoundary'
import { useBuscaDeLivros } from '../hooks/useBuscaDeLivros'
import { useLazyLoadGatilho } from '../hooks/useLazyLoadGatilho'
import styles from '../styles/pages/BuscarLivroPage.module.css'

/**
 * Buscar/Cadastrar Livro (#12). `query` (o que está no campo) e `termoBuscado` (o que de fato
 * dispara `useBuscaDeLivros`) são estados separados de propósito — a busca só acontece na
 * submissão do formulário, não a cada tecla digitada. `termoBuscado` começa em `''`, não em
 * `null`: campo vazio mostra o catálogo inteiro desde a entrada na página
 * (`livroService.buscarPorTitulo('')` devolve todos os livros), e limpar/submeter uma busca vazia
 * volta pra essa mesma listagem completa.
 *
 * Sem resultado, o formulário de cadastro manual não aparece direto — primeiro mostra um
 * `EmptyState` centralizado com a pergunta "Deseja cadastrar livro?"; o formulário só aparece
 * depois desse clique, dando a chance de tentar outro termo de busca antes de partir pro cadastro.
 *
 * **Atalho "Cadastrar livro" no cabeçalho (adição fora do escopo original da Etapa 12, a pedido do
 * responsável do projeto):** abre o mesmo `ManualBookForm`, agora dentro de um `Modal`, direto —
 * sem precisar buscar por um título que não existe primeiro. Os dois pontos de entrada (o atalho do
 * cabeçalho e o "Deseja cadastrar livro?" do `EmptyState`) compartilham o mesmo estado
 * `mostrarCadastro` e o mesmo formulário; só o texto de abertura do card muda conforme a origem
 * (`mensagemCadastro`), porque "Não encontramos esse livro" não faz sentido quando não houve busca
 * nenhuma por trás do clique.
 *
 * Única exceção à regra "busca só na submissão": apagar o campo até ficar vazio já volta a mostrar
 * o catálogo inteiro na hora, sem precisar submeter de novo — não é busca a cada tecla (isso
 * continua exigindo `aoBuscar`), é só o caso específico de "campo voltou a ficar vazio".
 *
 * Lazy load reaproveitado do Feed (`useLazyLoadGatilho`, a pedido do responsável do projeto: "a
 * mesma função no buscar livro e no descobrir") — `pagina` reseta pra `1` a cada busca nova
 * (`aoBuscar`/campo esvaziado), senão uma segunda busca herdaria a paginação da busca anterior.
 * `PageStateBoundary` só assume o `carregando` de tela cheia quando `pagina === 1` (não
 * `resultados.length === 0`, que ficaria `false` numa busca nova com uma busca anterior ainda com
 * resultado em `dado` — mostraria os resultados antigos por baixo enquanto a nova busca carrega,
 * uma busca "Duna" momentaneamente exibindo resultados de "Harry Potter"). Carregando página 2+
 * (lazy load) cai no `LoadingList` compacto embaixo da lista já carregada, mesmo padrão do Feed.
 */
function BuscarLivroPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [termoBuscado, setTermoBuscado] = useState('')
  const [mostrarCadastro, setMostrarCadastro] = useState(false)
  const [pagina, setPagina] = useState(1)

  const { dado, carregando, erro, recarregar } = useBuscaDeLivros(termoBuscado, pagina)

  const resultados = dado?.itens ?? []
  const temMais = (dado?.total ?? 0) > resultados.length

  const { indiceGatilho, onGatilhoRef } = useLazyLoadGatilho({
    temMais,
    quantidadeAtual: resultados.length,
    carregando,
    aoCarregarMais: () => setPagina((atual) => atual + 1),
  })

  function aoMudarQuery(valor) {
    setQuery(valor)
    if (valor.trim() === '') {
      setMostrarCadastro(false)
      setTermoBuscado('')
      setPagina(1)
    }
  }

  function aoBuscar(evento) {
    evento.preventDefault()
    setMostrarCadastro(false)
    setTermoBuscado(query.trim())
    setPagina(1)
  }

  const naoEncontrouNada = !carregando && !erro && resultados.length === 0

  return (
    <div className={styles.wrapper}>
      <PageHeader
        title="Buscar livro"
        actionLabel="Cadastrar livro"
        actionIcon={Plus}
        onAction={() => setMostrarCadastro(true)}
      />
      <BookSearchBar value={query} onChange={aoMudarQuery} onSubmit={aoBuscar} />
      <PageStateBoundary
        carregando={carregando && pagina === 1}
        erro={erro}
        recarregar={recarregar}
      >
        {naoEncontrouNada ? (
          <div className={styles.semResultado}>
            <EmptyState
              icon={BookX}
              title="Nenhum livro encontrado"
              description="Não encontramos nenhum livro com esse termo."
              actionLabel="Deseja cadastrar livro?"
              onAction={() => setMostrarCadastro(true)}
            />
          </div>
        ) : (
          <>
            <BookSearchResults
              resultados={resultados}
              indiceGatilho={indiceGatilho}
              onGatilhoRef={onGatilhoRef}
            />
            {carregando && resultados.length > 0 ? <LoadingList count={2} /> : null}
          </>
        )}
      </PageStateBoundary>
      <Modal open={mostrarCadastro} onClose={() => setMostrarCadastro(false)} title="Cadastrar livro">
        <ManualBookForm
          tituloInicial={naoEncontrouNada ? termoBuscado : ''}
          mensagem={
            naoEncontrouNada
              ? undefined
              : 'Preencha os dados do livro que você quer adicionar ao catálogo:'
          }
          onCadastrado={(livro) => {
            setMostrarCadastro(false)
            navigate(`/livros/${livro.id}`)
          }}
        />
      </Modal>
    </div>
  )
}

export { BuscarLivroPage }
