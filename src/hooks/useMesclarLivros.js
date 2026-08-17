import { useState } from 'react'

import { avaliacaoService } from '../services/avaliacaoService'
import { itemDaEstanteService } from '../services/itemDaEstanteService'
import { livroService } from '../services/livroService'

/**
 * Mutation de mesclar dois livros duplicados do catálogo (#22 — Gestão de Catálogo) — mantém
 * `livroPrincipalId`, remove `livroDuplicadoId`. A orquestração entre as 3 entidades fica aqui, no
 * hook, não dentro de `livroService`: `entidadeService.js` nunca importa outro `entidadeService.js`
 * neste projeto (só a fixture de `livroService`, ver `avaliacaoService.js`) — criar esse import
 * cruzado só pra esta etapa quebraria essa convenção sem necessidade, já que o hook já é o lugar
 * correto pra compor múltiplos services (Página → Hook → Service, `01-arquitetura-frontend.md`).
 *
 * Passo a passo:
 * 1. Reatribui cada avaliação do livro duplicado pro livro principal (`avaliacaoService.atualizar`
 *    já recalcula `mediaAvaliacoes`/`totalAvaliacoes` do livro de destino sozinho, Etapa 12 —
 *    nenhum recálculo manual necessário aqui).
 * 2. Reatribui cada item de estante do livro duplicado pro livro principal.
 * 3. Remove o livro duplicado do catálogo (`livroService.remover`, novo nesta etapa).
 *
 * **Simplificação documentada:** não trata o caso de um mesmo leitor ter avaliado ou adicionado à
 * estante os dois livros duplicados ao mesmo tempo — reatribuir criaria dois registros apontando
 * pro mesmo par usuário+livro principal. Cenário raro (o motivo de mesclar é justamente o leitor
 * não ter percebido que eram o mesmo livro) e não ocorre na fixture atual; um back-end real trataria
 * isso com uma constraint de unicidade no banco, fora do escopo de uma camada mock.
 * @param {(livroPrincipalId: string) => void} [aoConcluir]
 */
function useMesclarLivros(aoConcluir) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function mesclar(livroPrincipalId, livroDuplicadoId) {
    setEnviando(true)
    setErro(null)
    try {
      const [avaliacoesDoDuplicado, itensDoDuplicado] = await Promise.all([
        avaliacaoService.listarPorLivro(livroDuplicadoId),
        itemDaEstanteService.listarPorLivro(livroDuplicadoId),
      ])

      for (const avaliacao of avaliacoesDoDuplicado) {
        await avaliacaoService.atualizar(avaliacao.id, { livroId: livroPrincipalId })
      }
      for (const item of itensDoDuplicado) {
        await itemDaEstanteService.atualizar(item.id, { livroId: livroPrincipalId })
      }

      await livroService.remover(livroDuplicadoId)
      aoConcluir?.(livroPrincipalId)
    } catch (e) {
      setErro(e)
      throw e
    } finally {
      setEnviando(false)
    }
  }

  return { mesclar, enviando, erro }
}

export { useMesclarLivros }
