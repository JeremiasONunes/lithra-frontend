import { useState } from 'react'

import { livroService } from '../services/livroService'

/**
 * Mutation de cadastro manual de livro (`ManualBookForm`) — mesmo formato das mutations de
 * avaliação. Não está na lista de Hooks da Etapa 12 no roadmap, mas "cadastrar livro manualmente"
 * é uma Funcionalidade explícita dela; sem este hook, `ManualBookForm` chamaria `livroService`
 * direto, violando a regra de "nenhuma página/componente chama services/ diretamente". `aoConcluir`
 * recebe o livro recém-criado — quem chama usa isso pra navegar direto pra `/livros/:livroId`.
 * @param {(livro: object) => void} [aoConcluir]
 */
function useCadastrarLivro(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function cadastrar(dados) {
    setEnviando(true)
    setErro(null)
    try {
      const novo = await livroService.criar(dados)
      aoConcluir?.(novo)
      return novo
    } catch (e) {
      setErro(e)
      throw e
    } finally {
      setEnviando(false)
    }
  }

  return { cadastrar, enviando, erro }
}

export { useCadastrarLivro }
