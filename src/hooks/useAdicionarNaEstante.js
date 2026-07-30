import { useState } from 'react'

import { itemDaEstanteService } from '../services/itemDaEstanteService'

/**
 * Mutation de adicionar livro à estante — mesmo formato das mutations de avaliação (Etapa 12).
 * `aoConcluir` chamado só em caso de sucesso, recebe o item recém-criado.
 * @param {(item: object) => void} [aoConcluir]
 */
function useAdicionarNaEstante(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function adicionar(dados) {
    setEnviando(true)
    setErro(null)
    try {
      const novo = await itemDaEstanteService.criar(dados)
      aoConcluir?.(novo)
      return novo
    } catch (e) {
      setErro(e)
      throw e
    } finally {
      setEnviando(false)
    }
  }

  return { adicionar, enviando, erro }
}

export { useAdicionarNaEstante }
