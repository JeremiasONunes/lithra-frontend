import { useState } from 'react'

import { atividadeDoFeedService } from '../services/atividadeDoFeedService'

/**
 * Mutation de publicar uma atualização de texto livre — mesmo formato das demais mutations
 * (Etapas 12/13). `aoConcluir` chamado só em caso de sucesso, recebe a atividade recém-criada.
 * @param {(atividade: object) => void} [aoConcluir]
 */
function useCriarPost(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function publicar(dados) {
    setEnviando(true)
    setErro(null)
    try {
      const nova = await atividadeDoFeedService.criar(dados)
      aoConcluir?.(nova)
      return nova
    } catch (e) {
      setErro(e)
      throw e
    } finally {
      setEnviando(false)
    }
  }

  return { publicar, enviando, erro }
}

export { useCriarPost }
