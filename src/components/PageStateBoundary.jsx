import { AlertTriangle } from 'lucide-react'

import { EmptyState } from './EmptyState'
import { LoadingList } from './LoadingList'
import styles from '../styles/components/PageStateBoundary.module.css'

/**
 * Decide entre `LoadingList`/`EmptyState`(erro)/`EmptyState`(vazio)/conteúdo — evita repetir esse
 * `if`/`else` em cada página. Recebe exatamente o formato que `useAsync` (Etapa 8) já devolve
 * (`carregando`/`erro`/`recarregar`); `vazio` não vem de `useAsync` (que não sabe o formato de
 * `dado`) — quem chama deriva isso a partir do próprio `dado` (ex.: `livros.length === 0`).
 *
 * Convenção de quando usar cada estado:
 * - `carregando`: sempre que `useAsync` ainda não resolveu a primeira leitura (ou uma releitura via
 *   `recarregar()`) — mostra `LoadingList`, nunca a tela em branco.
 * - `erro`: quando `useAsync.erro` não é `null` — mostra `EmptyState` com ação "Tentar novamente"
 *   chamando `recarregar()`. Nunca é a mesma coisa que "vazio": erro é falha da leitura em si,
 *   vazio é leitura bem-sucedida sem nenhum registro.
 * - `vazio`: quando a leitura teve sucesso mas o resultado não tem nenhum item pra mostrar — cada
 *   página passa seu próprio `estadoVazio` (ícone/texto/ação), porque o texto certo depende do
 *   contexto ("Nenhum livro na estante" é diferente de "Nenhuma atividade no feed").
 * - conteúdo (`children`): nenhum dos três de cima — a página desenha o que quiser, sem wrapper.
 *
 * @example
 * // hooks/useEstante.js
 * function useEstante() {
 *   const buscar = useCallback(() => itemDaEstanteService.listarPorUsuario(usuario.id), [usuario.id])
 *   return useAsync(buscar)
 * }
 *
 * // pages/EstantePage.jsx
 * const { dado: itens, carregando, erro, recarregar } = useEstante()
 * return (
 *   <PageStateBoundary
 *     carregando={carregando}
 *     erro={erro}
 *     recarregar={recarregar}
 *     vazio={!carregando && !erro && itens?.length === 0}
 *     estadoVazio={{
 *       icon: BookOpen,
 *       title: 'Sua estante está vazia',
 *       description: 'Adicione livros pra começar a acompanhar sua leitura.',
 *       actionLabel: 'Buscar livro',
 *       onAction: () => navigate('/buscar-livro'),
 *     }}
 *   >
 *     <ListaDeLivros itens={itens} />
 *   </PageStateBoundary>
 * )
 *
 * @param {{
 *   carregando: boolean,
 *   erro?: unknown,
 *   vazio?: boolean,
 *   recarregar?: () => void,
 *   estadoVazio?: {
 *     icon: import('react').ComponentType,
 *     title: string,
 *     description?: string,
 *     actionLabel?: string,
 *     onAction?: () => void,
 *   },
 *   children: import('react').ReactNode,
 * }} props
 */
function PageStateBoundary({ carregando, erro, vazio = false, recarregar, estadoVazio, children }) {
  if (carregando) {
    return (
      <div className={styles.wrapper}>
        <LoadingList />
      </div>
    )
  }

  if (erro) {
    return (
      <div className={styles.wrapper}>
        <EmptyState
          icon={AlertTriangle}
          title="Algo deu errado"
          description="Não foi possível carregar os dados."
          actionLabel={recarregar ? 'Tentar novamente' : undefined}
          onAction={recarregar}
        />
      </div>
    )
  }

  if (vazio && estadoVazio) {
    return (
      <div className={styles.wrapper}>
        <EmptyState {...estadoVazio} />
      </div>
    )
  }

  return children
}

export { PageStateBoundary }
