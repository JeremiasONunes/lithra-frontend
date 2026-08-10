import { useState } from 'react'
import { Lock, User } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { EmptyState } from '../components/EmptyState'
import { PageStateBoundary } from '../components/PageStateBoundary'
import { ProfileHeader } from '../components/ProfileHeader'
import { ProfileStatsSummary } from '../components/ProfileStatsSummary'
import { ShelfGrid } from '../components/ShelfGrid'
import { useAuth } from '../context/AuthContext'
import { useEstante } from '../hooks/useEstante'
import { useLivros } from '../hooks/useLivros'
import { usePerfil } from '../hooks/usePerfil'
import { useSegueUsuario } from '../hooks/useSegueUsuario'
import { useSeguidores } from '../hooks/useSeguidores'
import { useSeguindo } from '../hooks/useSeguindo'
import styles from '../styles/pages/ProfilePage.module.css'

/**
 * Perfil do Leitor (#8) — renderização adaptada dono/visitante (`ProfileHeader`), com a Estante
 * (`ShelfGrid`, Etapa 13, modo `readOnly`) sujeita à regra de privacidade: um visitante que não
 * segue um perfil de estante privada não vê o conteúdo, só um aviso (Critério de Aceite da Etapa
 * 16). `:username` na rota é tratado como `usuario.id` — `Usuario` (Etapa 7/9) não tem campo
 * `username` próprio; decisão sinalizada como pendente desde a Etapa 10, resolvida assim pra não
 * exigir mudança no Cadastro (fora do escopo desta etapa) — ver Histórico de Revisão.
 */
function ProfilePage() {
  const { username: perfilId } = useParams()
  const { usuario: usuarioAtual } = useAuth()
  const dono = usuarioAtual.id === perfilId

  const { dado: perfil, carregando, erro, recarregar } = usePerfil(perfilId)
  const { dado: seguidores } = useSeguidores(perfilId)
  const { dado: seguindo } = useSeguindo(perfilId)
  const { dado: segueInicial } = useSegueUsuario(dono ? null : usuarioAtual.id, perfilId)
  // `FollowButton` (dentro de `ProfileHeader`) resolve o próprio estado numa instância de hook
  // separada desta — sem este override local, seguir alguém de estante privada direto por aqui
  // deixaria a Estante escondida até a página recarregar (o botão vira "Seguindo", mas esta página
  // não saberia). `aoMudarSegue` (repassado até `FollowButton`) mantém os dois em sincronia.
  const [segueLocal, setSegueLocal] = useState(null)
  const segue = segueLocal ?? segueInicial ?? false

  const estanteVisivel = dono || perfil?.privacidadeEstante === 'publica' || segue

  const { dado: itensDaEstante } = useEstante(perfilId, { status: 'lido' })
  const { dado: livros } = useLivros()

  const itensLidos = (itensDaEstante ?? [])
    .map((item) => ({ ...item, livro: livros?.find((livro) => livro.id === item.livroId) }))
    .filter((item) => item.livro)

  return (
    <div className={styles.wrapper}>
      <PageStateBoundary
        carregando={carregando}
        erro={erro}
        recarregar={recarregar}
        vazio={!carregando && !erro && !perfil}
        estadoVazio={{
          icon: User,
          title: 'Perfil não encontrado',
          description: 'Verifique o endereço e tente novamente.',
        }}
      >
        {perfil ? (
          <div className={styles.conteudo}>
            <ProfileHeader
              perfil={perfil}
              dono={dono}
              usuarioAtualId={usuarioAtual.id}
              aoMudarSegue={setSegueLocal}
            />
            <ProfileStatsSummary
              perfilId={perfil.id}
              totalSeguidores={seguidores?.length ?? 0}
              totalSeguindo={seguindo?.length ?? 0}
              totalLivrosLidos={itensLidos.length}
            />
            {estanteVisivel ? (
              <ShelfGrid itens={itensLidos} readOnly />
            ) : (
              <EmptyState
                icon={Lock}
                title="Estante privada"
                description="Siga esta pessoa pra ver os livros que já leu."
              />
            )}
          </div>
        ) : null}
      </PageStateBoundary>
    </div>
  )
}

export { ProfilePage }
