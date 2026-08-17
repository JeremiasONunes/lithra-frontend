import { useState } from 'react'

import { usuarioService } from '../services/usuarioService'

/**
 * Mutation de excluir a própria conta — "excluir", na prática, é `usuarioService.desativar`
 * (Etapa 7): desativa (`ativo: false`), nunca remove o registro, pra avaliações/itens de estante já
 * existentes continuarem referenciando um `usuarioId` válido (mesmo raciocínio já documentado no
 * próprio `usuarioService.js`, pensado desde a Etapa 7 pra esse cenário — "moderação/autoexclusão").
 * Mesmo formato das demais mutations.
 * @param {() => void} [aoConcluir]
 */
function useExcluirConta(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function excluir(usuarioId) {
    setEnviando(true)
    setErro(null)
    try {
      await usuarioService.desativar(usuarioId)
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

export { useExcluirConta }
