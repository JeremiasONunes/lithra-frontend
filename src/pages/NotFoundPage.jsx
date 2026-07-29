import { FileQuestion } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { EmptyState } from '../components/EmptyState'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/pages/NotFoundPage.module.css'

/** Tela #25 finalizada (Etapa 11) — reaproveita `EmptyState` (Etapa 6), mesmo padrão já usado em
 * `AcessoNaoAutorizadoPage` (Etapa 10). "Voltar" leva pra área do papel do usuário se autenticado,
 * ou pra Landing (`/`) se não — diferente de `AcessoNaoAutorizadoPage`, que só é alcançada já
 * autenticado (via guard), a 404 pode ser a primeira coisa que um visitante nunca logado encontra. */
function NotFoundPage() {
  const { autenticado, papel } = useAuth()
  const navigate = useNavigate()

  function aoVoltar() {
    if (!autenticado) {
      navigate('/')
      return
    }
    navigate(papel === 'administrador' ? '/admin' : '/feed')
  }

  return (
    <div className={styles.wrapper}>
      <EmptyState
        icon={FileQuestion}
        title="Página não encontrada"
        description="Verifique o endereço e tente novamente."
        actionLabel="Voltar"
        onAction={aoVoltar}
      />
    </div>
  )
}

export { NotFoundPage }
