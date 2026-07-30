import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { PageHeader } from '../components/PageHeader'
import { PageStateBoundary } from '../components/PageStateBoundary'
import { ReviewForm } from '../components/ReviewForm'
import { ShelfFilterByGenre } from '../components/ShelfFilterByGenre'
import { ShelfGrid } from '../components/ShelfGrid'
import { ShelfStatusTabs } from '../components/ShelfStatusTabs'
import { UpdateProgressModal } from '../components/UpdateProgressModal'
import { useAuth } from '../context/AuthContext'
import { useAvaliacoesDoLivro } from '../hooks/useAvaliacoesDoLivro'
import { useEstante } from '../hooks/useEstante'
import { useLivros } from '../hooks/useLivros'
import styles from '../styles/pages/EstantePage.module.css'

const ROTULO_ESTADO_VAZIO = {
  'quero-ler': 'Nenhum livro em "Quero Ler" ainda.',
  lendo: 'Nenhum livro em "Lendo" ainda.',
  lido: 'Nenhum livro em "Lido" ainda.',
}

/**
 * Minha Estante (#13). `status` e `genero` são dois filtros combinados: `status` alimenta
 * `useEstante` (repassado pro service); `genero` é aplicado aqui em cima do resultado já carregado
 * (não dispara nova busca/atraso simulado — troca instantânea). Trocar de aba reseta o filtro de
 * gênero pra "Todos", pra não esconder a estante inteira por um gênero que não existe na aba nova.
 */
function EstantePage() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const [status, setStatus] = useState('quero-ler')
  const [genero, setGenero] = useState('')
  const [itemSelecionado, setItemSelecionado] = useState(null)
  const [avaliandoLivroId, setAvaliandoLivroId] = useState(null)

  const { dado: itens, carregando, erro, recarregar } = useEstante(usuario.id, { status })
  const { dado: livros } = useLivros()
  const { dado: avaliacoesDoLivroEmAvaliacao } = useAvaliacoesDoLivro(avaliandoLivroId)

  function aoMudarStatus(novoStatus) {
    setStatus(novoStatus)
    setGenero('')
  }

  const itensComLivro = (itens ?? [])
    .map((item) => ({ ...item, livro: livros?.find((livro) => livro.id === item.livroId) }))
    .filter((item) => item.livro)

  const generosDisponiveis = [...new Set(itensComLivro.map((item) => item.livro.genero))].sort()

  const itensFiltrados = genero
    ? itensComLivro.filter((item) => item.livro.genero === genero)
    : itensComLivro

  const minhaAvaliacaoExistente = avaliacoesDoLivroEmAvaliacao?.find(
    (avaliacao) => avaliacao.usuarioId === usuario.id,
  )

  return (
    <div className={styles.wrapper}>
      <PageHeader title="Minha Estante" />
      <ShelfStatusTabs status={status} onChange={aoMudarStatus} />
      <ShelfFilterByGenre
        generos={generosDisponiveis}
        generoSelecionado={genero}
        onChange={setGenero}
      />
      <PageStateBoundary
        carregando={carregando}
        erro={erro}
        recarregar={recarregar}
        vazio={!carregando && !erro && itensFiltrados.length === 0}
        estadoVazio={{
          icon: BookOpen,
          title: ROTULO_ESTADO_VAZIO[status],
          description: 'Adicione livros pra começar a acompanhar sua leitura.',
          actionLabel: 'Buscar livro',
          onAction: () => navigate('/buscar-livro'),
        }}
      >
        <ShelfGrid itens={itensFiltrados} onSelecionarItem={setItemSelecionado} />
      </PageStateBoundary>
      <UpdateProgressModal
        item={itemSelecionado}
        open={!!itemSelecionado}
        onClose={() => setItemSelecionado(null)}
        onAtualizado={recarregar}
        onConcluidoLeitura={(item) => setAvaliandoLivroId(item.livroId)}
      />
      <ReviewForm
        open={!!avaliandoLivroId}
        onClose={() => setAvaliandoLivroId(null)}
        livroId={avaliandoLivroId}
        avaliacaoExistente={minhaAvaliacaoExistente}
        onSalvo={() => {}}
      />
    </div>
  )
}

export { EstantePage }
