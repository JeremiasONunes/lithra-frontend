import { createContext, useContext, useEffect, useState } from 'react'

import { usuarioService } from '../services/usuarioService'
import { lerUsuarioIdPersistido, persistirUsuarioId } from './authStorage'

const AuthContext = createContext(null)

/**
 * Sessão do usuário — substitui o valor mockado dos guards de rota da Etapa 5. `login`/`cadastrar`
 * chamam `usuarioService` e persistem o `id` do usuário no `localStorage` (`authStorage.js`);
 * `carregando` cobre a janela de hidratação no boot (relendo o usuário persistido antes de qualquer
 * guard decidir redirecionar).
 */
function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let cancelado = false

    async function hidratar() {
      const usuarioIdPersistido = lerUsuarioIdPersistido()
      if (!usuarioIdPersistido) {
        return
      }

      const encontrado = await usuarioService.buscarPorId(usuarioIdPersistido)
      if (cancelado) {
        return
      }

      if (encontrado && encontrado.ativo) {
        setUsuario(encontrado)
      } else {
        // Sessão persistida aponta pra um usuário inexistente ou desativado — descarta.
        persistirUsuarioId(null)
      }
    }

    hidratar().finally(() => !cancelado && setCarregando(false))

    return () => {
      cancelado = true
    }
  }, [])

  /** `null` quando as credenciais não conferem ou a conta está desativada — nunca lança erro pra
   * isso (mesmo contrato de `usuarioService.verificarCredenciais`); quem chama decide como mostrar
   * a mensagem (Etapa 9). */
  async function login(email, senha) {
    const encontrado = await usuarioService.verificarCredenciais(email, senha)
    if (!encontrado) {
      return null
    }
    setUsuario(encontrado)
    persistirUsuarioId(encontrado.id)
    return encontrado
  }

  function logout() {
    setUsuario(null)
    persistirUsuarioId(null)
  }

  /** Sincroniza o `usuario` da sessão depois de uma edição de perfil (Etapa 16) — só atualiza o
   * estado local, não persiste nada novo (o `id` da sessão não muda). Sem isto, `UserMenu`/qualquer
   * outro lugar que lê `useAuth().usuario` ficaria com nome/foto/bio desatualizados até um novo
   * login, já que `usuarioService.atualizar` não passa por aqui sozinho. */
  function atualizarUsuario(usuarioAtualizado) {
    setUsuario(usuarioAtualizado)
  }

  /** Propaga o erro de `usuarioService.criar` (ex.: e-mail já cadastrado) — diferente de `login`,
   * aqui é uma falha real, não um fluxo esperado. */
  async function cadastrar(dados) {
    const novoUsuario = await usuarioService.criar(dados)
    setUsuario(novoUsuario)
    persistirUsuarioId(novoUsuario.id)
    return novoUsuario
  }

  const valor = {
    usuario,
    papel: usuario?.papel ?? null,
    autenticado: !!usuario,
    carregando,
    login,
    logout,
    cadastrar,
    atualizarUsuario,
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider.')
  }
  return contexto
}

export { AuthProvider, useAuth }
