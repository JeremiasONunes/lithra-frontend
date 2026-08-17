import { useCallback } from 'react'

import { atividadeDoFeedService } from '../services/atividadeDoFeedService'
import { livroService } from '../services/livroService'
import { usuarioService } from '../services/usuarioService'
import { useAsync } from './useAsync'

const TAMANHO_ATIVIDADE_RECENTE = 5

/**
 * Indicadores gerais da plataforma pro Dashboard Administrativo (#21) — agregação client-side sobre
 * dado já mockado, mesmo espírito de `useReadingStats` (Etapa 17: "não é uma nova fonte de dado
 * primário, é uma função pura de agregação"). "Total de Avaliações" soma `livro.totalAvaliacoes` de
 * cada livro (campo já mantido por `avaliacaoService.recalcularMediaDoLivro` a cada escrita, Etapa
 * 12) em vez de precisar de um `avaliacaoService.listar()` novo só pra contar.
 *
 * `atividadesRecentes` reaproveita `atividadeDoFeedService.listar()` (Etapa 14, já devolve tudo
 * ordenado do mais recente pro mais antigo, documentado como "filtrar por quem o usuário segue é
 * responsabilidade de quem consome" — o Dashboard admin não filtra por seguimento, quer a atividade
 * de toda a plataforma) — autor/livro de cada item são resolvidos na página, mesmo padrão de
 * `FeedList`.
 */
function useAdminStats() {
  const buscar = useCallback(async () => {
    const [usuarios, livros, atividades] = await Promise.all([
      usuarioService.listar(),
      livroService.listar(),
      atividadeDoFeedService.listar(),
    ])

    return {
      totalLeitores: usuarios.filter((usuario) => usuario.papel === 'leitor').length,
      totalLivros: livros.length,
      totalAvaliacoes: livros.reduce((soma, livro) => soma + livro.totalAvaliacoes, 0),
      contasDesativadas: usuarios.filter((usuario) => !usuario.ativo).length,
      atividadesRecentes: atividades.slice(0, TAMANHO_ATIVIDADE_RECENTE),
    }
  }, [])

  return useAsync(buscar)
}

export { useAdminStats }
