import { Navigate, Outlet } from 'react-router-dom'

import { sessaoMock } from './sessionStub'

/** Guarda de rota — sem sessão mockada, redireciona pra `/login`. Composto como rota-pai sem
 * `path`, então protege qualquer `<Outlet />` aninhado abaixo dele em `AppRoutes.jsx`. */
function RequireAuth() {
  if (!sessaoMock.autenticado) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export { RequireAuth }
