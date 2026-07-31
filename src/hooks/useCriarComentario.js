import { useState } from 'react'

import { comentarioService } from '../services/comentarioService'

/**
 * Mutation de publicar um comentário numa atividade do feed — mesmo formato das demais mutations.
 * `aoConcluir` chamado só em caso de sucesso, recebe o comentário recém-criado.
 * @param {(comentario: object) => void} [aoConcluir]
 */
function useCriarComentario(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function criar(dados) {
    setEnviando(true)
    setErro(null)
    try {
      const novo = await comentarioService.criar(dados)
      aoConcluir?.(novo)
      return novo
    } catch (e) {
      setErro(e)
      throw e
    } finally {
      setEnviando(false)
    }
  }

  return { criar, enviando, erro }
}

export { useCriarComentario }
