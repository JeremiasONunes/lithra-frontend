import { AuthProvider } from './context/AuthContext'
import { UILayoutProvider } from './context/UILayoutContext'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <AuthProvider>
      <UILayoutProvider>
        <AppRoutes />
      </UILayoutProvider>
    </AuthProvider>
  )
}

export default App
