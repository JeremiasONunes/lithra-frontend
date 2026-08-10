import { useState } from 'react'

import { metaDeLeituraService } from '../services/metaDeLeituraService'

/**
 * Cria ou atualiza a Meta de Leitura — um hook só pros dois casos (`ReadingGoalForm` não precisa
 * saber qual dos dois usar): se já existe uma meta pro ano (`metaExistente`, vindo de
 * `useMetaDeLeitura`), atualiza; senão, cria. Mesmo formato das demais mutations, `aoConcluir`
 * chamado só em caso de sucesso.
 * @param {(meta: object) => void} [aoConcluir]
 */
function useAtualizarMetaDeLeitura(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function salvar(metaExistente, dados) {
    setEnviando(true)
    setErro(null)
    try {
      const resultado = metaExistente
        ? await metaDeLeituraService.atualizar(metaExistente.id, dados)
        : await metaDeLeituraService.criar(dados)
      aoConcluir?.(resultado)
      return resultado
    } catch (e) {
      setErro(e)
      throw e
    } finally {
      setEnviando(false)
    }
  }

  return { salvar, enviando, erro }
}

export { useAtualizarMetaDeLeitura }
