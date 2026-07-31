import { useState } from 'react'
import { Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../components/Button'
import { FeedComposer } from '../components/FeedComposer'
import { FeedList } from '../components/FeedList'
import { PageHeader } from '../components/PageHeader'
import { PageStateBoundary } from '../components/PageStateBoundary'
import { useAuth } from '../context/AuthContext'
import { useComentarAtividade } from '../hooks/useComentarAtividade'
import { useCurtirAtividade } from '../hooks/useCurtirAtividade'
import { useFeed } from '../hooks/useFeed'
import { useLivros } from '../hooks/useLivros'
import { useUsuarios } from '../hooks/useUsuarios'
import styles from '../styles/pages/FeedPage.module.css'

/** Feed (#5) — rota inicial pós-login do Leitor. */
function FeedPage() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [pagina, setPagina] = useState(1)

  const { dado, carregando, erro, recarregar } = useFeed(usuario.id, pagina)
  const { dado: usuarios } = useUsuarios()
  const { dado: livros } = useLivros()

  const { curtir } = useCurtirAtividade(recarregar)
  const { comentar } = useComentarAtividade(recarregar)

  const atividades = dado?.itens ?? []
  const temMais = (dado?.total ?? 0) > atividades.length

  return (
    <div className={styles.wrapper}>
      <PageHeader title="Feed" />
      <FeedComposer onPublicado={recarregar} />
      <PageStateBoundary
        carregando={carregando}
        erro={erro}
        recarregar={recarregar}
        vazio={!carregando && !erro && atividades.length === 0}
        estadoVazio={{
          icon: Users,
          title: 'Seu feed está vazio',
          description: 'Siga outras pessoas ou publique uma atualização pra ver algo por aqui.',
          actionLabel: 'Buscar livro',
          onAction: () => navigate('/buscar-livro'),
        }}
      >
        <div className={styles.conteudo}>
          <FeedList
            atividades={atividades}
            usuarios={usuarios}
            livros={livros}
            onCurtir={(atividade) => curtir(atividade.id)}
            onComentar={(atividade) => comentar(atividade.id)}
          />
          {temMais ? (
            <Button
              variant="ghost"
              className={styles.carregarMais}
              onClick={() => setPagina((atual) => atual + 1)}
            >
              Carregar mais
            </Button>
          ) : null}
        </div>
      </PageStateBoundary>
    </div>
  )
}

export { FeedPage }
