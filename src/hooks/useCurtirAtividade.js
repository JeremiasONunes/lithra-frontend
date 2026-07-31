import { useState } from 'react'

import { atividadeDoFeedService } from '../services/atividadeDoFeedService'

/**
 * Mutation de curtir/descurtir uma atividade — alterna (uma pessoa nunca tem mais de uma curtida
 * ativa na mesma atividade, ver `atividadeDoFeedService.curtir`). Mesmo formato das demais
 * mutations. `aoConcluir` chamado só em caso de sucesso, recebe a atividade já atualizada.
 * @param {(atividade: object) => void} [aoConcluir]
 */
function useCurtirAtividade(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function curtir(id, usuarioId) {
    setEnviando(true)
    setErro(null)
    try {
      const atualizada = await atividadeDoFeedService.curtir(id, usuarioId)
      aoConcluir?.(atualizada)
      return atualizada
    } catch (e) {
      setErro(e)
      throw e
    } finally {
      setEnviando(false)
    }
  }

  return { curtir, enviando, erro }
}

export { useCurtirAtividade }
