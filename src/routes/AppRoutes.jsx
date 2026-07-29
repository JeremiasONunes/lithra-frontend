import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { routeConfig } from './routeConfig'

const router = createBrowserRouter(routeConfig)

function AppRoutes() {
  return <RouterProvider router={router} />
}

export { AppRoutes }
