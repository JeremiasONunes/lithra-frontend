import { useState } from 'react'

import { usuarioService } from '../services/usuarioService'

/**
 * Mutation de reativar a conta de um usuário (moderação, Gestão de Usuários) — chama
 * `usuarioService.ativar`. Adição fora do escopo original da Etapa 19 (o roadmap só pede a ação de
 * desativar), a pedido do responsável do projeto; ver `progresso-implementacao.md`. Mesmo formato de
 * `useDesativarUsuario` (o par simétrico desta mutation).
 * @param {(usuario: object) => void} [aoConcluir]
 */
function useAtivarUsuario(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function ativar(usuarioId) {
    setEnviando(true)
    setErro(null)
    try {
      const atualizado = await usuarioService.ativar(usuarioId)
      aoConcluir?.(atualizado)
      return atualizado
    } catch (e) {
      setErro(e)
      throw e
    } finally {
      setEnviando(false)
    }
  }

  return { ativar, enviando, erro }
}

export { useAtivarUsuario }
