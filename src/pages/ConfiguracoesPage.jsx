import { useState } from 'react'

import { Card } from '../components/Card'
import { ChangePasswordForm } from '../components/ChangePasswordForm'
import { DeleteAccountSection } from '../components/DeleteAccountSection'
import { PageHeader } from '../components/PageHeader'
import { PrivacyToggle } from '../components/PrivacyToggle'
import { useAuth } from '../context/AuthContext'
import { useAtualizarPrivacidade } from '../hooks/useAtualizarPrivacidade'
import styles from '../styles/pages/ConfiguracoesPage.module.css'

/**
 * Configurações da Conta (#20) — alterar senha, privacidade da estante e exclusão de conta.
 *
 * `PrivacyToggle` aqui é controlado manualmente (não dentro de um `<form>` RHF, diferente de
 * `EditProfileForm`/Etapa 16) e salva na hora que muda, sem precisar de um botão "Salvar" à parte —
 * é o único controle desta seção, então a etapa o trata como "fonte de verdade centralizada"
 * (Descrição da Etapa 18), mesmo componente/mesma escrita (`usuarioService.atualizar`) que
 * `EditProfileForm` já usa, só disparada de forma diferente.
 *
 * Ambos `ChangePasswordForm`/`aoMudarPrivacidade` sincronizam `AuthContext.atualizarUsuario` (Etapa
 * 16) ao concluir — sem isso, `UserMenu`/`ProfilePage` (quando o próprio dono visita) ficariam com
 * dado desatualizado até um novo login.
 */
function ConfiguracoesPage() {
  const { usuario, atualizarUsuario } = useAuth()
  const [erroPrivacidade, setErroPrivacidade] = useState(null)

  const { atualizar, enviando: salvandoPrivacidade } = useAtualizarPrivacidade(atualizarUsuario)

  async function aoMudarPrivacidade(estantePublica) {
    setErroPrivacidade(null)
    try {
      await atualizar(usuario.id, estantePublica ? 'publica' : 'privada')
    } catch (erro) {
      setErroPrivacidade(erro.message)
    }
  }

  return (
    <div className={styles.wrapper}>
      <PageHeader title="Configurações" />
      <Card className={styles.secaoPrivacidade}>
        <h2 className={styles.tituloSecao}>Privacidade</h2>
        <PrivacyToggle
          checked={usuario.privacidadeEstante === 'publica'}
          disabled={salvandoPrivacidade}
          onChange={(evento) => aoMudarPrivacidade(evento.target.checked)}
        />
        {erroPrivacidade ? (
          <p role="alert" className={styles.erroGeral}>
            {erroPrivacidade}
          </p>
        ) : null}
      </Card>
      <ChangePasswordForm usuario={usuario} onAlterada={atualizarUsuario} />
      <DeleteAccountSection usuario={usuario} />
    </div>
  )
}

export { ConfiguracoesPage }
