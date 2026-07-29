import { useState } from 'react'

import { avaliacaoService } from '../services/avaliacaoService'

/**
 * Mutation de edição — mesmo formato de `useCriarAvaliacao`. `aoConcluir` chamado só em caso de
 * sucesso.
 * @param {(avaliacao: object) => void} [aoConcluir]
 */
function useAtualizarAvaliacao(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function atualizar(id, dados) {
    setEnviando(true)
    setErro(null)
    try {
      const atualizada = await avaliacaoService.atualizar(id, dados)
      aoConcluir?.(atualizada)
      return atualizada
    } catch (e) {
      setErro(e)
      throw e
    } finally {
      setEnviando(false)
    }
  }

  return { atualizar, enviando, erro }
}

export { useAtualizarAvaliacao }
