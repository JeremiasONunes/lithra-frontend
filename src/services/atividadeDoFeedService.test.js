import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { atividadeDoFeedService } from './atividadeDoFeedService'
import { resetMockData } from './mockStorage'

describe('atividadeDoFeedService', () => {
  beforeEach(() => {
    resetMockData()
  })

  afterEach(() => {
    resetMockData()
  })

  it('listar retorna todas as atividades, da mais recente para a mais antiga', async () => {
    const atividades = await atividadeDoFeedService.listar()
    expect(atividades.length).toBeGreaterThan(0)

    for (let i = 1; i < atividades.length; i += 1) {
      const anterior = new Date(atividades[i - 1].criadoEm).getTime()
      const atual = new Date(atividades[i].criadoEm).getTime()
      expect(anterior).toBeGreaterThanOrEqual(atual)
    }
  })

  it('listar cobre os 4 tipos de atividade na fixture', async () => {
    const atividades = await atividadeDoFeedService.listar()
    const tipos = new Set(atividades.map((atividade) => atividade.tipo))
    expect(tipos).toEqual(new Set(['avaliacao', 'progresso', 'adicao-estante', 'post-livre']))
  })

  it('listarPorUsuario retorna só atividades do usuário pedido', async () => {
    const atividades = await atividadeDoFeedService.listarPorUsuario('usuario-1')
    expect(atividades.every((atividade) => atividade.usuarioId === 'usuario-1')).toBe(true)
    expect(atividades.length).toBeGreaterThan(0)
  })

  it('buscarPorId encontra uma atividade existente', async () => {
    const atividade = await atividadeDoFeedService.buscarPorId('atividade-8')
    expect(atividade?.tipo).toBe('post-livre')
  })

  it('criar adiciona a atividade com curtidas/comentários zerados e persiste', async () => {
    const nova = await atividadeDoFeedService.criar({
      tipo: 'post-livre',
      usuarioId: 'usuario-1',
      texto: 'Testando o composer.',
    })

    expect(nova.curtidas).toBe(0)
    expect(nova.comentarios).toBe(0)

    const encontrada = await atividadeDoFeedService.buscarPorId(nova.id)
    expect(encontrada?.texto).toBe('Testando o composer.')
  })

  it('dado criado sobrevive a uma releitura simulando reload', async () => {
    await atividadeDoFeedService.criar({
      tipo: 'post-livre',
      usuarioId: 'usuario-1',
      texto: 'Persistente.',
    })
    const atividades = await atividadeDoFeedService.listarPorUsuario('usuario-1')
    expect(atividades.some((atividade) => atividade.texto === 'Persistente.')).toBe(true)
  })

  it('curtir incrementa curtidas em 1 e persiste', async () => {
    const antes = await atividadeDoFeedService.buscarPorId('atividade-1')
    const atualizada = await atividadeDoFeedService.curtir('atividade-1')
    expect(atualizada.curtidas).toBe(antes.curtidas + 1)

    const releitura = await atividadeDoFeedService.buscarPorId('atividade-1')
    expect(releitura.curtidas).toBe(antes.curtidas + 1)
  })

  it('comentar incrementa comentarios em 1 e persiste', async () => {
    const antes = await atividadeDoFeedService.buscarPorId('atividade-1')
    const atualizada = await atividadeDoFeedService.comentar('atividade-1')
    expect(atualizada.comentarios).toBe(antes.comentarios + 1)

    const releitura = await atividadeDoFeedService.buscarPorId('atividade-1')
    expect(releitura.comentarios).toBe(antes.comentarios + 1)
  })

  it('curtir lança erro pra atividade inexistente', async () => {
    await expect(atividadeDoFeedService.curtir('atividade-inexistente')).rejects.toThrow(
      'Atividade não encontrada.',
    )
  })
})
