import { ShieldAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { EmptyState } from '../components/EmptyState'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/pages/AcessoNaoAutorizadoPage.module.css'

/** Tela #26 finalizada (Etapa 10) — reaproveita `EmptyState` (Etapa 6) em vez de um componente
 * novo, já que a etapa não lista nenhum componente próprio pra ela. "Voltar" leva pra área do
 * próprio papel do usuário (não pra rota anterior — poderia ser a mesma rota que causou o
 * redirecionamento). */
function AcessoNaoAutorizadoPage() {
  const { papel } = useAuth()
  const navigate = useNavigate()

  return (
    <div className={styles.wrapper}>
      <EmptyState
        icon={ShieldAlert}
        title="Acesso não autorizado"
        description="Você não tem permissão para acessar esta página."
        actionLabel="Voltar"
        onAction={() => navigate(papel === 'administrador' ? '/admin' : '/feed')}
      />
    </div>
  )
}

export { AcessoNaoAutorizadoPage }
