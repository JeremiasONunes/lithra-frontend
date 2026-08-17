import { useState } from 'react'

import { MockServiceError } from '../services/mockStorage'
import { usuarioService } from '../services/usuarioService'

/**
 * Mutation de alterar a própria senha — "validando senha atual mockada" (Descrição da Etapa 18):
 * reaproveita `usuarioService.verificarCredenciais` (Etapa 7, já usado no login) pra confirmar a
 * senha atual antes de trocar, em vez de comparar `usuario.senha` direto aqui (mantém a checagem de
 * credencial como responsabilidade do service, não do hook). Mesmo formato das demais mutations.
 * @param {(usuario: object) => void} [aoConcluir]
 */
function useAlterarSenha(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function alterar(usuario, senhaAtual, novaSenha) {
    setEnviando(true)
    setErro(null)
    try {
      const confere = await usuarioService.verificarCredenciais(usuario.email, senhaAtual)
      if (!confere) {
        throw new MockServiceError('Senha atual incorreta.')
      }
      const atualizado = await usuarioService.atualizar(usuario.id, { senha: novaSenha })
      aoConcluir?.(atualizado)
      return atualizado
    } catch (e) {
      setErro(e)
      throw e
    } finally {
      setEnviando(false)
    }
  }

  return { alterar, enviando, erro }
}

export { useAlterarSenha }
