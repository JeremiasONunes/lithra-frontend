import { useState } from 'react'

import { atividadeDoFeedService } from '../services/atividadeDoFeedService'

/**
 * Mutation de curtir uma atividade — mesmo formato das demais mutations. `aoConcluir` chamado só em
 * caso de sucesso, recebe a atividade com `curtidas` já incrementado.
 * @param {(atividade: object) => void} [aoConcluir]
 */
function useCurtirAtividade(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function curtir(id) {
    setEnviando(true)
    setErro(null)
    try {
      const atualizada = await atividadeDoFeedService.curtir(id)
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
