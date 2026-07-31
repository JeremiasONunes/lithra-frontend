import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { atividadeDoFeedService } from './atividadeDoFeedService'
import { comentarioService } from './comentarioService'
import { resetMockData } from './mockStorage'

describe('comentarioService', () => {
  beforeEach(() => {
    resetMockData()
  })

  afterEach(() => {
    resetMockData()
  })

  it('listarPorAtividade retorna a fixture semeada, do mais antigo pro mais novo', async () => {
    const comentarios = await comentarioService.listarPorAtividade('atividade-1')
    expect(comentarios.length).toBe(2)

    for (let i = 1; i < comentarios.length; i += 1) {
      const anterior = new Date(comentarios[i - 1].criadoEm).getTime()
      const atual = new Date(comentarios[i].criadoEm).getTime()
      expect(anterior).toBeLessThanOrEqual(atual)
    }
  })

  it('listarPorAtividade retorna lista vazia pra atividade sem comentários', async () => {
    const comentarios = await comentarioService.listarPorAtividade('atividade-2')
    expect(comentarios).toEqual([])
  })

  it('criar adiciona o comentário e persiste', async () => {
    const novo = await comentarioService.criar({
      atividadeId: 'atividade-2',
      usuarioId: 'usuario-1',
      texto: 'Comentário novo de teste.',
    })

    expect(novo.id).toBeTruthy()
    expect(novo.criadoEm).toBeTruthy()

    const comentarios = await comentarioService.listarPorAtividade('atividade-2')
    expect(comentarios.some((comentario) => comentario.texto === 'Comentário novo de teste.')).toBe(
      true,
    )
  })

  it('criar sincroniza o contador comentarios da atividade correspondente', async () => {
    const antes = await atividadeDoFeedService.buscarPorId('atividade-2')
    expect(antes.comentarios).toBe(0)

    await comentarioService.criar({
      atividadeId: 'atividade-2',
      usuarioId: 'usuario-1',
      texto: 'Primeiro comentário.',
    })
    await comentarioService.criar({
      atividadeId: 'atividade-2',
      usuarioId: 'usuario-3',
      texto: 'Segundo comentário.',
    })

    const depois = await atividadeDoFeedService.buscarPorId('atividade-2')
    expect(depois.comentarios).toBe(2)
  })

  it('comentário criado sobrevive a uma releitura simulando reload', async () => {
    await comentarioService.criar({
      atividadeId: 'atividade-3',
      usuarioId: 'usuario-1',
      texto: 'Persistente.',
    })
    const comentarios = await comentarioService.listarPorAtividade('atividade-3')
    expect(comentarios.some((comentario) => comentario.texto === 'Persistente.')).toBe(true)
  })
})
