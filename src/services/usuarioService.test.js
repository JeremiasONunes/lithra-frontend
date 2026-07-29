import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { resetMockData } from './mockStorage'
import { usuarioService } from './usuarioService'

describe('usuarioService', () => {
  beforeEach(() => {
    resetMockData()
  })

  afterEach(() => {
    resetMockData()
  })

  it('listar retorna a fixture semeada no localStorage', async () => {
    const usuarios = await usuarioService.listar()
    expect(usuarios.length).toBeGreaterThan(0)
    expect(usuarios[0]).toHaveProperty('email')
  })

  it('buscarPorId encontra um usuário existente', async () => {
    const usuario = await usuarioService.buscarPorId('usuario-1')
    expect(usuario?.nome).toBe('Mariana Silva')
  })

  it('buscarPorEmail é case-insensitive', async () => {
    const usuario = await usuarioService.buscarPorEmail('MARIANA@exemplo.com')
    expect(usuario?.id).toBe('usuario-1')
  })

  it('verificarCredenciais retorna o usuário quando e-mail/senha conferem e a conta está ativa', async () => {
    const usuario = await usuarioService.verificarCredenciais('mariana@exemplo.com', 'senha123')
    expect(usuario?.id).toBe('usuario-1')
  })

  it('verificarCredenciais retorna null para senha incorreta', async () => {
    const usuario = await usuarioService.verificarCredenciais('mariana@exemplo.com', 'errada')
    expect(usuario).toBeNull()
  })

  it('verificarCredenciais retorna null para conta desativada', async () => {
    const usuario = await usuarioService.verificarCredenciais('rafael@exemplo.com', 'senha123')
    expect(usuario).toBeNull()
  })

  it('criar adiciona um novo usuário e persiste entre chamadas', async () => {
    const novo = await usuarioService.criar({
      nome: 'Novo Leitor',
      email: 'novo@exemplo.com',
      senha: 'senha123',
    })

    expect(novo.id).toBeTruthy()
    expect(novo.papel).toBe('leitor')
    expect(novo.ativo).toBe(true)

    const encontrado = await usuarioService.buscarPorId(novo.id)
    expect(encontrado?.email).toBe('novo@exemplo.com')
  })

  it('criar rejeita e-mail já cadastrado', async () => {
    await expect(
      usuarioService.criar({ nome: 'Duplicado', email: 'mariana@exemplo.com', senha: 'x' }),
    ).rejects.toThrow()
  })

  it('atualizar altera os campos informados e persiste', async () => {
    const atualizado = await usuarioService.atualizar('usuario-1', { bio: 'Nova bio' })
    expect(atualizado.bio).toBe('Nova bio')

    const encontrado = await usuarioService.buscarPorId('usuario-1')
    expect(encontrado?.bio).toBe('Nova bio')
  })

  it('desativar marca ativo como false sem remover o registro', async () => {
    const desativado = await usuarioService.desativar('usuario-2')
    expect(desativado.ativo).toBe(false)

    const encontrado = await usuarioService.buscarPorId('usuario-2')
    expect(encontrado).toBeDefined()
    expect(encontrado?.ativo).toBe(false)
  })

  it('dado criado sobrevive a uma releitura simulando reload (nova leitura do localStorage)', async () => {
    await usuarioService.criar({
      nome: 'Persistente',
      email: 'persistente@exemplo.com',
      senha: 'x',
    })
    const usuarios = await usuarioService.listar()
    expect(usuarios.some((usuario) => usuario.email === 'persistente@exemplo.com')).toBe(true)
  })
})
