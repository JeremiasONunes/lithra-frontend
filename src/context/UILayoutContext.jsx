import { createContext, useContext, useState } from 'react'

const UILayoutContext = createContext(null)

/**
 * Estado de layout puramente de interface — não guarda dado de produto nem de sessão (por isso
 * separado do `AuthContext`, responsabilidade única). Hoje só a sidebar recolhida/expandida em
 * telas largas, que a navegação principal (Etapa 10) vai consumir; não persiste entre sessões
 * (reseta a cada carregamento da página, comportamento esperado de estado de UI).
 */
function UILayoutProvider({ children }) {
  const [sidebarRecolhida, setSidebarRecolhida] = useState(false)

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
