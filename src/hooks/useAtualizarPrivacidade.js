import { useState } from 'react'

import { usuarioService } from '../services/usuarioService'

/**
 * Mutation de alterar `privacidadeEstante` — mesma escrita que `EditProfileForm` (Etapa 16) já faz
 * como parte do próprio formulário de perfil (`usuarioService.atualizar`), só que aqui dispara
 * sozinha, na hora que o `PrivacyToggle` muda (`ConfiguracoesPage`, Etapa 18 — "fonte de verdade"
 * centralizada, mas a mesma escrita de sempre, não um caminho novo). Mesmo formato das demais
 * mutations.
 * @param {(usuario: object) => void} [aoConcluir]
 */
function useAtualizarPrivacidade(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function atualizar(usuarioId, privacidadeEstante) {
    setEnviando(true)
    setErro(null)
    try {
      const atualizado = await usuarioService.atualizar(usuarioId, { privacidadeEstante })
      aoConcluir?.(atualizado)
      return atualizado
    } catch (e) {
      setErro(e)
      throw e
    } finally {
      setEnviando(false)
    }
  }

  return { atualizar, enviando, erro }
}

export { useAtualizarPrivacidade }
