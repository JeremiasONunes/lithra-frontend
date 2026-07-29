import { useState } from 'react'
import { BookOpen, ChevronLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { BookDetailHeader } from '../components/BookDetailHeader'
import { BookSynopsis } from '../components/BookSynopsis'
import { PageStateBoundary } from '../components/PageStateBoundary'
import { ReviewForm } from '../components/ReviewForm'
import { ReviewList } from '../components/ReviewList'
import { useAuth } from '../context/AuthContext'
import { useAvaliacoesDoLivro } from '../hooks/useAvaliacoesDoLivro'
import { useExcluirAvaliacao } from '../hooks/useExcluirAvaliacao'
import { useLivro } from '../hooks/useLivro'
import { useUsuarios } from '../hooks/useUsuarios'
import styles from '../styles/pages/BookPage.module.css'

/** Página do Livro (#11). */
function BookPage() {
  const { livroId } = useParams()
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const {
    dado: livro,
    carregando: carregandoLivro,
    erro: erroLivro,
    recarregar: recarregarLivro,
  } = useLivro(livroId)
  const {
    dado: avaliacoes,
    carregando: carregandoAvaliacoes,
    erro: erroAvaliacoes,
    recarregar: recarregarAvaliacoes,
  } = useAvaliacoesDoLivro(livroId)
  const { dado: usuarios } = useUsuarios()

  const [formularioAberto, setFormularioAberto] = useState(false)

  function aoConcluirMutacao() {
    recarregarLivro()
    recarregarAvaliacoes()
  }

  const { excluir } = useExcluirAvaliacao(aoConcluirMutacao)

  const minhaAvaliacao = avaliacoes?.find((avaliacao) => avaliacao.usuarioId === usuario.id)

  return (
    <div className={styles.wrapper}>
      <Link to="/feed" className={styles.voltar}>
        <ChevronLeft size={16} aria-hidden="true" />
        Voltar
      </Link>
      <PageStateBoundary
        carregando={carregandoLivro}
        erro={erroLivro}
        recarregar={recarregarLivro}
        vazio={!carregandoLivro && !erroLivro && !livro}
        estadoVazio={{
          icon: BookOpen,
          title: 'Livro não encontrado',
          description: 'Verifique o endereço e tente novamente.',
          actionLabel: 'Buscar outro livro',
          onAction: () => navigate('/buscar-livro'),
        }}
      >
        {livro ? (
          <div className={styles.conteudo}>
            <BookDetailHeader
              livro={livro}
              jaAvaliou={!!minhaAvaliacao}
              onAvaliar={() => setFormularioAberto(true)}
            />
            <BookSynopsis sinopse={livro.sinopse} />
            <section className={styles.avaliacoes}>
              <h2 className={styles.tituloAvaliacoes}>Avaliações da comunidade</h2>
              <PageStateBoundary
                carregando={carregandoAvaliacoes}
                erro={erroAvaliacoes}
                recarregar={recarregarAvaliacoes}
                vazio={!carregandoAvaliacoes && !erroAvaliacoes && avaliacoes?.length === 0}
                estadoVazio={{
                  icon: BookOpen,
                  title: 'Nenhuma avaliação ainda',
                  description: 'Seja a primeira pessoa a avaliar este livro.',
                }}
              >
                <ReviewList
                  avaliacoes={avaliacoes ?? []}
                  usuarios={usuarios}
                  usuarioAtualId={usuario.id}
                  onEditar={() => setFormularioAberto(true)}
                  onExcluir={(avaliacao) => excluir(avaliacao.id)}
                />
              </PageStateBoundary>
            </section>
            <ReviewForm
              open={formularioAberto}
              onClose={() => setFormularioAberto(false)}
              livroId={livroId}
              avaliacaoExistente={minhaAvaliacao}
              onSalvo={aoConcluirMutacao}
            />
          </div>
        ) : null}
      </PageStateBoundary>
    </div>
  )
}

export { BookPage }
