import { useState } from 'react'

import { seguimentoService } from '../services/seguimentoService'

/**
 * Mutation de deixar de seguir um usuário — mesmo formato das demais mutations. `aoConcluir`
 * chamado só em caso de sucesso.
 * @param {() => void} [aoConcluir]
 */
function useDeixarDeSeguir(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function deixarDeSeguir(seguidorId, seguidoId) {
    setEnviando(true)
    setErro(null)
    try {
      await seguimentoService.deixarDeSeguir(seguidorId, seguidoId)
      aoConcluir?.()
    } catch (e) {
      setErro(e)
      throw e
    } finally {
      setEnviando(false)
    }
  }

  return { deixarDeSeguir, enviando, erro }
}

export { useDeixarDeSeguir }
