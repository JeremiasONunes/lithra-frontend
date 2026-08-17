import { useCallback, useState } from 'react'

import { configuracaoDoSistemaService } from '../services/configuracaoDoSistemaService'
import { useAsync } from './useAsync'

/**
 * Leitura + escrita das Configurações do Sistema (#24) num hook só — diferente do resto do projeto
 * (leitura e mutation em hooks separados, ex. `useEstante`/`useAdicionarNaEstante`), porque o
 * roadmap nomeia um único hook pra esta etapa (`useConfiguracoesDoSistema`) e a tela é um formulário
 * simples de parâmetro único, sem lista nem necessidade de outra tela consumir só a leitura — separar
 * em dois hooks aqui só adicionaria um arquivo a mais sem reuso real (mesmo raciocínio de
 * simplicidade já registrado em `01-arquitetura-frontend.md`, "previsibilidade... sem exceção por
 * conveniência" aplicado ao contrário: a exceção aqui É a convenção, porque o roadmap pediu um hook
 * só).
 */
function useConfiguracoesDoSistema() {
  const buscar = useCallback(() => configuracaoDoSistemaService.obter(), [])
  const { dado, carregando, erro, recarregar } = useAsync(buscar)

  const [salvando, setSalvando] = useState(false)
  const [erroAoSalvar, setErroAoSalvar] = useState(null)

  async function salvar(dados) {
    setSalvando(true)
    setErroAoSalvar(null)
    try {
      const atualizada = await configuracaoDoSistemaService.atualizar(dados)
      recarregar()
      return atualizada
    } catch (e) {
      setErroAoSalvar(e)
      throw e
    } finally {
      setSalvando(false)
    }
  }

  return { dado, carregando, erro, recarregar, salvar, salvando, erroAoSalvar }
}

export { useConfiguracoesDoSistema }
