import { useState } from 'react'

import { itemDaEstanteService } from '../services/itemDaEstanteService'

/**
 * Mutation de atualizar progresso/status de um item da estante — mesmo formato das demais
 * mutations. `aoConcluir` chamado só em caso de sucesso, recebe o item atualizado.
 * @param {(item: object) => void} [aoConcluir]
 */
function useAtualizarItemDaEstante(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function atualizar(id, dados) {
    setEnviando(true)
    setErro(null)
    try {
      const atualizado = await itemDaEstanteService.atualizar(id, dados)
      aoConcluir?.(atualizado)
      return atualizado
    } catch (e) {
      setErro(e)
      throw e
    } finally {
      setEnviando(false)
    }
  }

  return { atualizar, enviando, erro }
}

export { useAtualizarItemDaEstante }
