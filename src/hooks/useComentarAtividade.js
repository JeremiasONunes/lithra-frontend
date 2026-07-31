import { useState } from 'react'

import { atividadeDoFeedService } from '../services/atividadeDoFeedService'

/**
 * Mutation de comentar uma atividade — mesmo formato das demais mutations. `aoConcluir` chamado só
 * em caso de sucesso, recebe a atividade com `comentarios` já incrementado.
 * @param {(atividade: object) => void} [aoConcluir]
 */
function useComentarAtividade(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function comentar(id) {
    setEnviando(true)
    setErro(null)
    try {
      const atualizada = await atividadeDoFeedService.comentar(id)
      aoConcluir?.(atualizada)
      return atualizada
    } catch (e) {
      setErro(e)
      throw e
    } finally {
      setEnviando(false)
    }
  }

  return { comentar, enviando, erro }
}

export { useComentarAtividade }
