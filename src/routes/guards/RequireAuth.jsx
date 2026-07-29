import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

/** Guarda de rota — sem sessão, redireciona pra `/login`. Composto como rota-pai sem `path`, então
 * protege qualquer `<Outlet />` aninhado abaixo dele em `AppRoutes.jsx`. Enquanto `AuthProvider`
 * ainda está hidratando a sessão persistida (`carregando`), não decide nada — evita redirecionar
 * pra `/login` por um instante mesmo quando a sessão existe (a leitura do usuário persistido é
 * assíncrona). */
function RequireAuth() {
  const { autenticado, carregando } = useAuth()

  if (carregando) {
    return null
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export { RequireAuth }
