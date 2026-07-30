import { useState } from 'react'

import { itemDaEstanteService } from '../services/itemDaEstanteService'

/**
 * Mutation de remover um livro da estante — mesmo formato das demais mutations. `aoConcluir`
 * chamado só em caso de sucesso.
 * @param {() => void} [aoConcluir]
 */
function useRemoverDaEstante(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function remover(id) {
    setEnviando(true)
    setErro(null)
    try {
      await itemDaEstanteService.remover(id)
      aoConcluir?.()
    } catch (e) {
      setErro(e)
      throw e
    } finally {
      setEnviando(false)
    }
  }

  return { remover, enviando, erro }
}

export { useRemoverDaEstante }
