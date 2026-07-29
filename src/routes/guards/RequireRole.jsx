import { Navigate, Outlet } from 'react-router-dom'

import { sessaoMock } from './sessionStub'

/** Guarda de papel — assume que já passou por `RequireAuth` (é sempre composto dentro dele em
 * `AppRoutes.jsx`); papel incompatível redireciona pra `/nao-autorizado`. */
function RequireRole({ papel }) {
  if (sessaoMock.papel !== papel) {
    return <Navigate to="/nao-autorizado" replace />
  }

  return <Outlet />
}

export { RequireRole }
