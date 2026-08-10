import { useState } from 'react'

import { seguimentoService } from '../services/seguimentoService'

/**
 * Mutation de seguir um usuário — mesmo formato das demais mutations. `aoConcluir` chamado só em
 * caso de sucesso.
 * @param {() => void} [aoConcluir]
 */
function useSeguir(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function seguir(seguidorId, seguidoId) {
    setEnviando(true)
    setErro(null)
    try {
      const novo = await seguimentoService.seguir(seguidorId, seguidoId)
      aoConcluir?.()
      return novo
    } catch (e) {
      setErro(e)
      throw e
    } finally {
      setEnviando(false)
    }
  }

  return { seguir, enviando, erro }
}

export { useSeguir }
