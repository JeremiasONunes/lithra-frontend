import { useState } from 'react'
import { UserCheck, UserX } from 'lucide-react'

import { useAtivarUsuario } from '../hooks/useAtivarUsuario'
import { useDesativarUsuario } from '../hooks/useDesativarUsuario'
import { Badge } from './Badge'
import { Button } from './Button'
import { Card } from './Card'
import { ConfirmDialog } from './ConfirmDialog'
import { UserAvatar } from './UserAvatar'
import styles from '../styles/components/UserManagementTable.module.css'

/**
 * Gestão de Usuários (#23) — lista de leitores com badge de status e ações de desativar/reativar.
 * Cards empilhados, não `<table>` HTML (mesmo raciocínio de `CatalogManagementTable`, ver
 * `Lythra Design System/readme.md`).
 *
 * **"Reativar" é uma adição fora do escopo original da Etapa 19** (o roadmap só pede a ação de
 * desativar) — a pedido do responsável do projeto, ver `progresso-implementacao.md`. Sem
 * `ConfirmDialog`, diferente de "Desativar": reativar não é uma ação destrutiva/irreversível (o
 * próprio "Desativar" continua disponível logo em seguida se for engano), então pedir confirmação
 * aqui só adicionaria atrito sem proteger de nada.
 *
 * A conta do próprio admin logado (`usuarioAtualId`) nunca mostra o botão "Desativar" — desativar a
 * própria conta administradora pelo painel a derrubaria da sessão sem um segundo administrador pra
 * reverter (mock não tem esse conceito); mesmo cuidado de auto-exclusão já usado em `FollowButton`
 * (Etapa 16, "não renderiza nada se `seguidorId`/`seguidoId` coincidirem"). Não se aplica a
 * "Reativar" — uma conta desativada nunca é a conta logada (login mockado já recusa credenciais de
 * conta inativa, `usuarioService.verificarCredenciais`), então essa checagem seria morta ali.
 * @param {{ usuarios: object[], usuarioAtualId: string, onAlterado: () => void }} props
 */
function UserManagementTable({ usuarios, usuarioAtualId, onAlterado }) {
  const [usuarioParaDesativar, setUsuarioParaDesativar] = useState(null)
  const [erro, setErro] = useState(null)

  const { desativar, enviando } = useDesativarUsuario(() => {
    setUsuarioParaDesativar(null)
    onAlterado()
  })

  const { ativar, enviando: ativando } = useAtivarUsuario(onAlterado)

  async function aoConfirmar() {
    setErro(null)
    try {
      await desativar(usuarioParaDesativar.id)
    } catch (e) {
      setErro(e.message)
    }
  }

  async function aoReativar(usuario) {
    setErro(null)
    try {
      await ativar(usuario.id)
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <div className={styles.lista}>
      {usuarios.map((usuario) => (
        <Card key={usuario.id} className={styles.linha}>
          <UserAvatar name={usuario.nome} src={usuario.fotoUrl} size="md" />
          <div className={styles.info}>
            <span className={styles.nome}>{usuario.nome}</span>
            <span className={styles.email}>{usuario.email}</span>
          </div>
          <Badge tone={usuario.papel === 'administrador' ? 'accent' : 'neutral'}>
            {usuario.papel === 'administrador' ? 'Administrador' : 'Leitor'}
          </Badge>
          <Badge tone={usuario.ativo ? 'secondary' : 'danger'}>
            {usuario.ativo ? 'Ativo' : 'Desativado'}
          </Badge>
          {usuario.id !== usuarioAtualId && usuario.ativo ? (
            <Button variant="ghost" size="sm" onClick={() => setUsuarioParaDesativar(usuario)}>
              <UserX size={16} aria-hidden="true" />
              Desativar
            </Button>
          ) : null}
          {!usuario.ativo ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => aoReativar(usuario)}
              disabled={ativando}
            >
              <UserCheck size={16} aria-hidden="true" />
              Reativar
            </Button>
          ) : null}
        </Card>
      ))}
      <ConfirmDialog
        open={!!usuarioParaDesativar}
        onClose={() => setUsuarioParaDesativar(null)}
        onConfirm={aoConfirmar}
        title="Desativar usuário"
        message={
          usuarioParaDesativar
            ? `Tem certeza que deseja desativar a conta de ${usuarioParaDesativar.nome}? A pessoa não vai mais conseguir entrar no Lythra.`
            : ''
        }
        confirmLabel={enviando ? 'Desativando...' : 'Desativar'}
        destructive
      />
      {erro ? (
        <p role="alert" className={styles.erroGeral}>
          {erro}
        </p>
      ) : null}
    </div>
  )
}

export { UserManagementTable }
