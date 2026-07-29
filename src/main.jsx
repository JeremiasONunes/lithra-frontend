import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import DevTokensPage from './DevTokensPage.jsx'
import DevComponentesPage from './DevComponentesPage.jsx'

// Sem React Router ainda (só nasce na Etapa 5) — checagem simples de rota pra conferência visual
// das Etapas 3 e 4. Descartável, removida junto com as páginas `Dev*Page.jsx` até a Etapa 5.
function paginaParaRenderizar() {
  if (window.location.pathname === '/dev/tokens') return <DevTokensPage />
  if (window.location.pathname === '/dev/componentes') return <DevComponentesPage />
  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>{paginaParaRenderizar()}</StrictMode>,
)
