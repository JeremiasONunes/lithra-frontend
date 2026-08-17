import { Users } from 'lucide-react'

import { PageHeader } from '../components/PageHeader'
import { PageStateBoundary } from '../components/PageStateBoundary'
import { UserManagementTable } from '../components/UserManagementTable'
import { useAuth } from '../context/AuthContext'
import { useUsuariosAdmin } from '../hooks/useUsuariosAdmin'
import styles from '../styles/pages/AdminUsersPage.module.css'

/**
 * Gestão de Usuários (#23) — lista de todos os usuários com ações de desativar/reativar conta
 * ("Reativar" é adição fora do escopo original desta etapa, a pedido do responsável do projeto).
 * `usuario.id` (admin logado) passa pra `UserManagementTable` pra esconder o botão "Desativar" na
 * própria linha do admin — ver comentário no componente.
 */
function AdminUsersPage() {
  const { usuario } = useAuth()
  const { dado: usuarios, carregando, erro, recarregar } = useUsuariosAdmin()

  return (
    <div className={styles.wrapper}>
      <PageHeader title="Gestão de usuários" />
      <PageStateBoundary
        carregando={carregando}
        erro={erro}
        recarregar={recarregar}
        vazio={!carregando && !erro && usuarios?.length === 0}
        estadoVazio={{
          icon: Users,
          title: 'Nenhum usuário cadastrado',
          description: 'Os leitores cadastrados no Lythra aparecem aqui.',
        }}
      >
        <UserManagementTable
          usuarios={usuarios ?? []}
          usuarioAtualId={usuario.id}
          onAlterado={recarregar}
        />
      </PageStateBoundary>
    </div>
  )
}

export { AdminUsersPage }
