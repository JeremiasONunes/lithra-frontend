import { useState } from 'react'

import { avaliacaoService } from '../services/avaliacaoService'

/**
 * Mutation de exclusão — mesmo formato de `useCriarAvaliacao`. `aoConcluir` chamado só em caso de
 * sucesso.
 * @param {() => void} [aoConcluir]
 */
function useExcluirAvaliacao(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function excluir(id) {
    setEnviando(true)
    setErro(null)
    try {
      await avaliacaoService.remover(id)
      aoConcluir?.()
    } catch (e) {
      setErro(e)
      throw e
    } finally {
      setEnviando(false)
    }
  }

  return { excluir, enviando, erro }
}

export { useExcluirAvaliacao }
