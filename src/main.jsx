import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import DevTokensPage from './DevTokensPage.jsx'

// Sem React Router ainda (só nasce na Etapa 5) — checagem simples de rota pra conferência visual
// dos tokens da Etapa 3. Descartável, removida junto com `DevTokensPage.jsx` até a Etapa 5.
const emDevTokens = window.location.pathname === '/dev/tokens'

createRoot(document.getElementById('root')).render(
  <StrictMode>{emDevTokens ? <DevTokensPage /> : <App />}</StrictMode>,
)
