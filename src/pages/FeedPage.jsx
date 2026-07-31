import { useCallback, useEffect, useRef, useState } from 'react'
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

  // Lazy load (sem botão "carregar mais"): o gatilho fica sempre no penúltimo item do lote mais
  // recente de `TAMANHO_PAGINA` (`atividades.length - 2`, ver useFeed.js) — quando ele entra na
  // tela, a próxima página já começa a carregar, antes do usuário bater no fim de verdade. Como
  // essa posição é recalculada a cada vez que `atividades` cresce, ela "reinicia" sozinha a cada
  // novo lote (penúltimo do 1º lote = índice `TAMANHO_PAGINA - 2`; penúltimo do 2º lote = índice
  // `2 * TAMANHO_PAGINA - 2`...).
  const observerRef = useRef(null)
  // Espelha `carregando` num ref — o observer (criado uma vez por item-gatilho, via `useCallback`
  // sem depender de `carregando`) precisa do valor mais atual sem precisar recriar o observer toda
  // vez que `carregando` muda (senão o ref-callback dispara de novo a cada fetch).
  const carregandoRef = useRef(carregando)
  useEffect(() => {
    carregandoRef.current = carregando
  }, [carregando])

  const aoDefinirGatilho = useCallback((elemento) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
    if (!elemento) return

    // `root` explícito: o Feed rola dentro de `<main>` (`ReaderLayout`, `overflow-y: auto`), não a
    // viewport inteira — sem isso, `IntersectionObserver` (que por padrão usa a viewport como
    // referência) não detecta corretamente o scroll de um contêiner interno em todo navegador.
    const raiz = elemento.closest('main')

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting || carregandoRef.current) return
        setPagina((atual) => atual + 1)
      },
      // `rootMargin` pequeno de propósito: com poucos itens por página (`TAMANHO_PAGINA`, ver
      // useFeed.js) e cards relativamente compactos, uma margem grande (testado com 600px) cobre
      // quase a lista inteira já na primeira renderização — o próximo lote carregava quase
      // instantaneamente, sem nenhuma sensação de "lazy" pro usuário. 100px só antecipa o
      // suficiente pra não esperar o usuário bater no pixel exato do fim.
      { root: raiz, rootMargin: '100px' },
    )
    observer.observe(elemento)
    observerRef.current = observer
  }, [])

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
            indiceGatilho={temMais ? atividades.length - 2 : -1}
            onGatilhoRef={aoDefinirGatilho}
            onCurtir={(atividade) => curtir(atividade.id, usuario.id)}
          />
          {carregando && atividades.length > 0 ? <LoadingList count={2} /> : null}
        </div>
      </PageStateBoundary>
    </div>
  )
}

export { FeedPage }
