import { useState } from 'react'

import { avaliacaoService } from '../services/avaliacaoService'

/**
 * Mutation, não leitura — não usa `useAsync` (que é só pra leitura). Expõe função + estado de
 * envio, como toda mutation do projeto a partir daqui. `aoConcluir` é chamado só em caso de
 * sucesso — quem chama passa ali os `recarregar()` dos hooks de leitura afetados (o próprio livro,
 * pra média atualizar sem reload manual, e a lista de avaliações).
 * @param {(avaliacao: object) => void} [aoConcluir]
 */
function useCriarAvaliacao(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function criar(dados) {
    setEnviando(true)
    setErro(null)
    try {
      const nova = await avaliacaoService.criar(dados)
      aoConcluir?.(nova)
      return nova
    } catch (e) {
      setErro(e)
      throw e
    } finally {
      setEnviando(false)
    }
  }

  return { criar, enviando, erro }
}

export { useCriarAvaliacao }
