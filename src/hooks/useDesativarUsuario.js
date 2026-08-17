import { useState } from 'react'

import { usuarioService } from '../services/usuarioService'

/**
 * Mutation de desativar a conta de um usuário (moderação, #23 — Gestão de Usuários) — chama
 * `usuarioService.desativar` (já existe desde a Etapa 7, pensado desde então pra este uso: ver
 * comentário `ativo: boolean - moderação (Etapa 19)` no arquivo do service). Mesmo formato das
 * demais mutations do projeto (`useExcluirConta`, `useAlterarSenha`).
 * @param {(usuario: object) => void} [aoConcluir]
 */
function useDesativarUsuario(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function desativar(usuarioId) {
    setEnviando(true)
    setErro(null)
    try {
      const atualizado = await usuarioService.desativar(usuarioId)
      aoConcluir?.(atualizado)
      return atualizado
    } catch (e) {
      setErro(e)
      throw e
    } finally {
      setEnviando(false)
    }
  }

  return { desativar, enviando, erro }
}

export { useDesativarUsuario }
