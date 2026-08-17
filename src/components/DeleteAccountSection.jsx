import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { useExcluirConta } from '../hooks/useExcluirConta'
import { Button } from './Button'
import { Card } from './Card'
import { ConfirmDialog } from './ConfirmDialog'
import styles from '../styles/components/DeleteAccountSection.module.css'

/**
 * Excluir conta (#20) — exige confirmação explícita (`ConfirmDialog`, Etapa 6, `destructive`) antes
 * de excluir. "Excluir" é `usuarioService.desativar` (Etapa 7) por baixo, nunca remove o registro —
 * ver `useExcluirConta.js`. Ao confirmar com sucesso: `logout()` (`AuthContext`, Etapa 8) encerra a
 * sessão e `navigate('/')` volta pra Landing Page, exatamente o Critério de Aceite da etapa.
 * @param {{ usuario: object }} props
 */
function DeleteAccountSection({ usuario }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [confirmando, setConfirmando] = useState(false)
  const [erroGeral, setErroGeral] = useState(null)

  const { excluir, enviando } = useExcluirConta(() => {
    // Bug real, encontrado pelo teste desta etapa: o React Router (v7) despacha a atualização de
    // rota de `navigate()` como uma transição de baixa prioridade (`startTransition` internamente),
    // enquanto `setUsuario(null)` do `logout()` é uma atualização normal/urgente. Chamando os dois
    // juntos (em qualquer ordem, com ou sem `ReactDOM.flushSync` envolvendo a chamada por fora), a
    // atualização de contexto sempre "vence" e é aplicada primeiro — o `RequireAuth` (Etapa 5/8)
    // ainda montado repinta com `autenticado=false` enquanto a rota ainda é `/configuracoes`, e
    // redireciona pra `/login`, sobrescrevendo a transição pendente pra `/`. A opção
    // `flushSync: true` do próprio `navigate()` (não um `ReactDOM.flushSync` por fora) resolve isso
    // na raiz: instrui o React Router a aplicar a mudança de rota de forma síncrona, não como
    // transição — `/` já é a rota ativa antes de `logout()` rodar, então quando `autenticado` vira
    // `false`, `RequireAuth` nem está mais montado pra reagir.
    navigate('/', { replace: true, flushSync: true })
    logout()
  })

  async function aoConfirmar() {
    setErroGeral(null)
    try {
      await excluir(usuario.id)
    } catch (erro) {
      setErroGeral(erro.message)
      setConfirmando(false)
    }
  }

  return (
    <Card className={styles.card}>
      <h2 className={styles.titulo}>Excluir conta</h2>
      <p className={styles.aviso}>
        Sua conta será desativada e você será desconectado imediatamente.
      </p>
      {erroGeral ? (
        <p role="alert" className={styles.erroGeral}>
          {erroGeral}
        </p>
      ) : null}
      <Button
        variant="ghost"
        className={styles.botaoExcluir}
        onClick={() => setConfirmando(true)}
        disabled={enviando}
      >
        Excluir minha conta
      </Button>
      <ConfirmDialog
        open={confirmando}
        onClose={() => setConfirmando(false)}
        onConfirm={aoConfirmar}
        title="Excluir conta"
        message="Tem certeza que deseja excluir sua conta? Você será desconectado imediatamente e não poderá acessá-la de novo por conta própria."
        confirmLabel="Excluir conta"
        destructive
      />
    </Card>
  )
}

export { DeleteAccountSection }
