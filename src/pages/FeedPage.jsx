import { useState } from 'react'
import { Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { FeedComposer } from '../components/FeedComposer'
import { FeedList } from '../components/FeedList'
import { LoadingList } from '../components/LoadingList'
import { PageHeader } from '../components/PageHeader'
import { PageStateBoundary } from '../components/PageStateBoundary'
import { useAuth } from '../context/AuthContext'
import { useCurtirAtividade } from '../hooks/useCurtirAtividade'
import { useFeed } from '../hooks/useFeed'
import { useLazyLoadGatilho } from '../hooks/useLazyLoadGatilho'
import { useLivros } from '../hooks/useLivros'
import { useUsuarios } from '../hooks/useUsuarios'
import styles from '../styles/pages/FeedPage.module.css'

/** Feed (#5) — rota inicial pós-login do Leitor. */
function FeedPage() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [pagina, setPagina] = useState(1)
  // Curtir atualiza só o card clicado, sem recarregar o feed inteiro (que passaria de novo pelo
  // estado de `carregando` do PageStateBoundary — a lista some e volta, parecendo um reload da
  // página). Guarda por id só o que muda (`curtidas`/`curtidoPor`) e sobrepõe no render.
  const [curtidasLocais, setCurtidasLocais] = useState({})

  const { dado, carregando, erro, recarregar } = useFeed(usuario.id, pagina)
  const { dado: usuarios } = useUsuarios()
  const { dado: livros } = useLivros()

  const { curtir } = useCurtirAtividade((atualizada) => {
    setCurtidasLocais((atual) => ({
      ...atual,
      [atualizada.id]: { curtidas: atualizada.curtidas, curtidoPor: atualizada.curtidoPor },
    }))
  })

  const atividades = (dado?.itens ?? []).map((atividade) =>
    curtidasLocais[atividade.id] ? { ...atividade, ...curtidasLocais[atividade.id] } : atividade,
  )
  const temMais = (dado?.total ?? 0) > atividades.length

  // Lazy load (sem botão "carregar mais"): mesmo gatilho reaproveitado por Buscar Livro/Descobrir
  // (`useLazyLoadGatilho.js`) — penúltimo item do lote mais recente de `TAMANHO_PAGINA` (ver
  // useFeed.js), recalculado a cada vez que `atividades` cresce, "reiniciando" sozinho a cada novo
  // lote sem lógica extra.
  const { indiceGatilho, onGatilhoRef } = useLazyLoadGatilho({
    temMais,
    quantidadeAtual: atividades.length,
    carregando,
    aoCarregarMais: () => setPagina((atual) => atual + 1),
  })

  return (
    <div className={styles.wrapper}>
      <PageHeader title="Feed" />
      <FeedComposer onPublicado={recarregar} />
      <PageStateBoundary
        carregando={carregando && atividades.length === 0}
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
            usuarioAtualId={usuario.id}
            indiceGatilho={indiceGatilho}
            onGatilhoRef={onGatilhoRef}
            onCurtir={(atividade) => curtir(atividade.id, usuario.id)}
          />
          {carregando && atividades.length > 0 ? <LoadingList count={2} /> : null}
        </div>
      </PageStateBoundary>
    </div>
  )
}

export { FeedPage }
