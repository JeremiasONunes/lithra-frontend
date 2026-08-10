import { useState } from 'react'

import { usuarioService } from '../services/usuarioService'

/**
 * Mutation de editar o próprio perfil — mesmo formato das demais mutations. `aoConcluir` chamado só
 * em caso de sucesso, recebe o usuário já atualizado (quem chama decide o que fazer com ele — ver
 * `EditarPerfilPage`, que também sincroniza `AuthContext.atualizarUsuario`).
 * @param {(usuario: object) => void} [aoConcluir]
 */
function useAtualizarPerfil(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function atualizar(id, dados) {
    setEnviando(true)
    setErro(null)
    try {
      const atualizado = await usuarioService.atualizar(id, dados)
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

export { useAtualizarPerfil }
