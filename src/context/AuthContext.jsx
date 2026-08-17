import { createContext, useContext, useEffect, useState } from 'react'

import { usuarioService } from '../services/usuarioService'
import { lerUsuarioIdPersistido, persistirUsuarioId } from './authStorage'

/*
 * TEORIA: A CONTEXT API — RESOLVENDO "PROP DRILLING"
 * ---------------------------------------------------------------------------
 * Sem Context, um dado como "quem é o usuário logado" precisaria ser
 * passado como PROP de componente em componente — `App` passaria pra
 * `ReaderLayout`, que passaria pra `AppNavigation`, que passaria pra
 * `UserMenu`, mesmo que nenhum dos componentes "do meio" (`ReaderLayout`,
 * `AppNavigation`) precisasse desse dado pra si — só estariam repassando
 * adiante. Esse repasse forçado por vários níveis é chamado de PROP
 * DRILLING, e é um dos problemas que a Context API do React resolve: um
 * `Provider` no topo da árvore disponibiliza um valor que qualquer
 * componente ABAIXO dele (não importa quantos níveis de distância) pode ler
 * diretamente, via `useContext`, sem que nenhum componente intermediário
 * precise saber que aquele dado está passando por ele.
 *
 * O PADRÃO EM TRÊS PARTES: `createContext` + `Provider` + hook de consumo
 * ---------------------------------------------------------------------------
 *   1. `createContext(null)` cria o "canal" — um objeto que serve só de
 *      identificador; o `null` é o valor default se alguém tentar consumir
 *      o contexto por fora de qualquer `Provider` (situação que este
 *      arquivo trata como ERRO, ver `useAuth()` mais abaixo).
 *   2. `<AuthContext.Provider value={valor}>` (dentro de `AuthProvider`)
 *      é quem de fato ENTREGA um valor pra árvore abaixo dele — qualquer
 *      re-render deste `Provider` com um `valor` novo propaga pra todo
 *      consumidor automaticamente.
 *   3. `useAuth()`, um HOOK PRÓPRIO que só encapsula `useContext(AuthContext)`,
 *      é o que todo componente do projeto realmente usa pra ler a sessão —
 *      nunca `useContext(AuthContext)` direto. Ver o porquê logo abaixo da
 *      função.
 */

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

  /*
   * TEORIA: "HIDRATAÇÃO" — RECONSTRUINDO ESTADO QUE JÁ EXISTIA ANTES DE ABRIR A PÁGINA
   * -------------------------------------------------------------------------
   * Ao carregar a página pela primeira vez (ou dar F5), o React sempre
   * começa do ZERO — `usuario` nasce `null`, mesmo que a pessoa já tivesse
   * feito login antes de recarregar. "Hidratação" é o nome do processo de
   * RECONSTRUIR esse estado a partir de algo persistido (aqui,
   * `localStorage`) antes de decidir o que mostrar na tela. Como ler do
   * `usuarioService` é assíncrono (mesmo mock simulando um pequeno atraso
   * de rede), existe uma JANELA DE TEMPO entre "a página carregou" e
   * "já sabemos se há sessão" — é exatamente isso que `carregando` existe
   * pra cobrir: enquanto `true`, os guards de rota (`RequireAuth`) evitam
   * decidir qualquer redirecionamento, pra não mandar por engano pra
   * `/login` alguém que, na verdade, está logado (só ainda não confirmado).
   *
   * O FLAG `cancelado` — PROTEÇÃO CONTRA ATUALIZAR ESTADO DE UM EFEITO "VELHO"
   * -------------------------------------------------------------------------
   * `useEffect` roda de novo toda vez que suas dependências mudam (aqui,
   * nunca — o array `[]` no final significa "só na montagem"), mas mesmo
   * assim existe um risco real: e se o COMPONENTE for desmontado ANTES da
   * Promise `hidratar()` terminar? Sem proteção, `setUsuario`/`setCarregando`
   * seriam chamados num componente que não existe mais — o React avisa isso
   * como um erro em desenvolvimento ("Can't perform a React state update on
   * an unmounted component"). A função de LIMPEZA do `useEffect` (o
   * `return () => { cancelado = true }`) roda automaticamente quando o
   * componente desmonta; checar `if (cancelado) return` antes de cada
   * `setState` garante que uma resposta que chega TARDE demais é
   * simplesmente ignorada, em vez de causar esse erro. É o mesmo padrão
   * defensivo já usado em `hooks/useAsync.js`.
   */
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
   * a mensagem (Etapa 9). Repare que `setUsuario` (estado React, some ao recarregar a página) e
   * `persistirUsuarioId` (localStorage, sobrevive ao recarregar) são chamados JUNTOS — são dois
   * mecanismos com propósitos diferentes: o estado React existe pra a INTERFACE reagir
   * imediatamente (re-renderizar o menu, redirecionar); o `localStorage` existe pra a sessão
   * SOBREVIVER a um F5, sendo relida na próxima hidratação. */
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

  // O "valor público" do contexto — repare que `papel`/`autenticado` são CALCULADOS a partir de
  // `usuario`, não guardados em `useState` próprio: são "estado derivado" (deriva de outro estado
  // já existente). Guardá-los separadamente arriscaria os dois ficarem DESSINCRONIZADOS um do outro
  // (ex.: alguém atualiza `usuario` e esquece de atualizar `autenticado` junto) — calcular na hora
  // garante que estão sempre coerentes entre si, ao custo de recalcular a cada render (irrelevante
  // aqui, é só uma leitura de propriedade e uma comparação).
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

/*
 * TEORIA: POR QUE UM HOOK PRÓPRIO EM VEZ DE `useContext(AuthContext)` DIRETO
 * ---------------------------------------------------------------------------
 * Qualquer componente PODERIA chamar `useContext(AuthContext)` diretamente
 * — mas todo componente deste projeto usa `useAuth()` em vez disso, por
 * dois motivos práticos:
 *   1. MENSAGEM DE ERRO ÚTIL: se alguém usar `useAuth()` fora de um
 *      `AuthProvider` (esquecimento comum em teste, ou numa parte do app
 *      renderizada fora da árvore esperada), o erro diz exatamente o
 *      problema ("useAuth precisa ser usado dentro de um AuthProvider").
 *      Sem essa checagem, o componente simplesmente receberia `null` (o
 *      valor default do `createContext(null)`) e quebraria mais adiante
 *      com um erro genérico tipo "Cannot read property 'usuario' of null"
 *      — muito mais difícil de rastrear até a causa real.
 *   2. ENCAPSULAMENTO: se um dia `AuthContext` precisasse ser dividido em
 *      dois contextos, ou trocado de implementação, só `useAuth()}` (e o
 *      `AuthProvider` acima) precisariam mudar — nenhum dos componentes
 *      que já chamam `useAuth()` em todo o projeto precisaria ser tocado.
 */
function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider.')
  }
  return contexto
}

export { AuthProvider, useAuth }
