import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  delay,
  generateId,
  maybeFail,
  MockServiceError,
  readCollection,
  resetMockData,
  writeCollection,
} from './mockStorage'

describe('mockStorage', () => {
  beforeEach(() => {
    resetMockData()
  })

  afterEach(() => {
    resetMockData()
  })

  it('readCollection semeia o localStorage na primeira leitura', () => {
    const seed = [{ id: '1', valor: 'a' }]
    const lido = readCollection('usuarios', seed)
    expect(lido).toEqual(seed)

    const bruto = localStorage.getItem('lythra:mock:usuarios')
    expect(bruto).not.toBeNull()
    expect(JSON.parse(bruto)).toEqual(seed)
  })

  it('readCollection não resemeia depois da primeira leitura', () => {
    readCollection('usuarios', [{ id: '1', valor: 'a' }])
    writeCollection('usuarios', [{ id: '2', valor: 'b' }])

    const lido = readCollection('usuarios', [{ id: '1', valor: 'a' }])
    expect(lido).toEqual([{ id: '2', valor: 'b' }])
  })

  it('writeCollection persiste dados que uma nova leitura enxerga', () => {
    writeCollection('livros', [{ id: '9', valor: 'x' }])
    const lido = readCollection('livros', [])
    expect(lido).toEqual([{ id: '9', valor: 'x' }])
  })

  it('resetMockData apaga todas as coleções conhecidas', () => {
    writeCollection('usuarios', [{ id: '1', valor: 'a' }])
    writeCollection('livros', [{ id: '2', valor: 'b' }])

    resetMockData()

    expect(localStorage.getItem('lythra:mock:usuarios')).toBeNull()
    expect(localStorage.getItem('lythra:mock:livros')).toBeNull()
  })

  it('delay resolve depois do tempo simulado', async () => {
    vi.useFakeTimers()
    const promessa = delay(300)
    let resolvida = false
    promessa.then(() => {
      resolvida = true
    })

    await vi.advanceTimersByTimeAsync(300)
    await promessa

    expect(resolvida).toBe(true)
    vi.useRealTimers()
  })

  it('maybeFail nunca lança quando probability é 0 (padrão)', () => {
    expect(() => maybeFail()).not.toThrow()
  })

  it('maybeFail lança MockServiceError quando probability é 1', () => {
    expect(() => maybeFail(1, 'falhou de propósito')).toThrow(MockServiceError)
  })

  it('generateId gera ids diferentes a cada chamada, com o prefixo pedido', () => {
    const primeiro = generateId('usuario')
    const segundo = generateId('usuario')

    expect(primeiro).not.toBe(segundo)
    expect(primeiro.startsWith('usuario-')).toBe(true)
  })
})
