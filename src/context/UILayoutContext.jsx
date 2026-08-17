import { createContext, useContext, useState } from 'react'

/*
 * Mesmo padrão em três partes de `AuthContext.jsx` (`createContext` +
 * `Provider` + hook próprio de consumo) — a teoria completa da Context API,
 * de "prop drilling" ao motivo de existir um hook `useX()` dedicado em vez
 * de `useContext(XContext)` direto, está documentada lá; não repetida aqui.
 * O que VALE a pena repetir é uma pergunta diferente: por que este é um
 * SEGUNDO contexto, em vez de só mais um campo dentro de `AuthContext`?
 *
 * TEORIA: UM CONTEXTO POR RESPONSABILIDADE, NÃO UM CONTEXTO "GAVETA DE TUDO"
 * ---------------------------------------------------------------------------
 * `AuthContext` responde "quem está logado, com que papel". `UILayoutContext`
 * responde uma pergunta completamente diferente: "como a interface está
 * organizada agora" (sidebar recolhida ou não). Nenhuma das duas perguntas
 * tem relação com a outra — misturar as duas dentro de um `AuthContext`
 * único não economizaria nada de verdade, e ainda criaria um acoplamento
 * artificial: TODO componente que só precisa saber "estou logado?" passaria
 * a depender de um objeto que também muda por um motivo que não tem nada a
 * ver com login (o usuário clicou pra recolher a sidebar) — e, como o
 * `value` de um `Provider` é um objeto novo a cada render onde qualquer
 * parte dele muda, isso poderia disparar re-renders de componentes que só
 * se importam com a sessão, toda vez que a sidebar for aberta/fechada. Dois
 * contextos separados, cada um só mudando pelo seu próprio motivo, evitam
 * esse acoplamento.
 *
 * POR QUE ISTO NÃO PERSISTE EM `localStorage` (DIFERENTE DE `AuthContext`)
 * ---------------------------------------------------------------------------
 * `AuthContext` persiste a sessão de propósito (ninguém quer logar de novo
 * a cada F5). `UILayoutContext` não persiste NADA — recarregar a página
 * sempre volta a sidebar pro estado padrão (`false`, expandida). Isso não é
 * uma limitação, é a decisão correta pro tipo de dado: sessão é algo que a
 * pessoa espera continuar existindo entre visitas; "a sidebar estava
 * recolhida na minha última visita" não é uma expectativa real de nenhum
 * usuário — é estado de interface descartável, do tipo que faz sentido
 * nascer do zero a cada carregamento.
 */

const UILayoutContext = createContext(null)

/**
 * Estado de layout puramente de interface — não guarda dado de produto nem de sessão (por isso
 * separado do `AuthContext`, responsabilidade única). Hoje só a sidebar recolhida/expandida em
 * telas largas, que a navegação principal (Etapa 10) vai consumir; não persiste entre sessões
 * (reseta a cada carregamento da página, comportamento esperado de estado de UI).
 */
function UILayoutProvider({ children }) {
  const [sidebarRecolhida, setSidebarRecolhida] = useState(false)

  // Alterna entre os dois estados a partir do ATUAL, não de uma variável externa capturada no
  // momento em que a função foi criada — a forma `setState(atual => ...)` (updater function) é a
  // maneira segura de "inverter um booleano" em React, garantindo que o valor usado é sempre o mais
  // recente, mesmo se houver múltiplas atualizações enfileiradas antes do próximo render.
  function alternarSidebar() {
    setSidebarRecolhida((atual) => !atual)
  }

  const valor = { sidebarRecolhida, alternarSidebar }

  return <UILayoutContext.Provider value={valor}>{children}</UILayoutContext.Provider>
}

function useUILayout() {
  const contexto = useContext(UILayoutContext)
  if (!contexto) {
    throw new Error('useUILayout precisa ser usado dentro de um UILayoutProvider.')
  }
  return contexto
}

export { UILayoutProvider, useUILayout }
