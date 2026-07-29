import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

/** Guarda de papel — assume que já passou por `RequireAuth` (é sempre composto dentro dele em
 * `AppRoutes.jsx`, que já cobre a espera pela hidratação); papel incompatível redireciona pra
 * `/nao-autorizado`. */
function RequireRole({ papel }) {
  const { papel: papelAtual } = useAuth()

  if (papelAtual !== papel) {
    return <Navigate to="/nao-autorizado" replace />
  }

  return <Outlet />
}

export { RequireRole }
