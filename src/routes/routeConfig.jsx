import { AdminLayout } from '../components/AdminLayout'
import { PlaceholderPage } from '../components/PlaceholderPage'
import { PublicLayout } from '../components/PublicLayout'
import { ReaderLayout } from '../components/ReaderLayout'
import { RouteErrorBoundary } from '../components/RouteErrorBoundary'
import { RequireAuth } from './guards/RequireAuth'
import { RequireRole } from './guards/RequireRole'

/**
 * Toda a árvore de rotas do produto, declarada num só lugar — nenhuma rota "pertence" a uma
 * feature. Cada rota abaixo aponta pra `PlaceholderPage`; etapas futuras (9, 10, 12-19) substituem
 * só o `element` da rota correspondente pela tela real, sem tocar na estrutura da árvore.
 *
 * Separado de `AppRoutes.jsx` (não `createBrowserRouter` aqui) só pra `AppRoutes.test.jsx` poder
 * montar um `createMemoryRouter` próprio, com URL inicial controlada por teste — e pra manter
 * `AppRoutes.jsx` exportando só o componente (`react-refresh/only-export-components`).
 */
const routeConfig = [
  {
    element: <PublicLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: '/', element: <PlaceholderPage title="Landing" /> },
      { path: '/login', element: <PlaceholderPage title="Login" /> },
      { path: '/cadastro', element: <PlaceholderPage title="Cadastro" /> },
      { path: '/recuperar-senha', element: <PlaceholderPage title="Recuperar senha" /> },
      {
        path: '/nao-autorizado',
        element: (
          <PlaceholderPage
            title="Acesso não autorizado"
            description="Você não tem permissão para acessar esta página."
          />
        ),
      },
      {
        path: '*',
        element: (
          <PlaceholderPage
            title="Página não encontrada"
            description="Verifique o endereço e tente novamente."
          />
        ),
      },
    ],
  },
  {
    element: <RequireAuth />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <ReaderLayout />,
        children: [
          { path: '/feed', element: <PlaceholderPage title="Feed" /> },
          { path: '/descobrir', element: <PlaceholderPage title="Descobrir" /> },
          { path: '/busca', element: <PlaceholderPage title="Busca" /> },
          { path: '/recomendados', element: <PlaceholderPage title="Recomendados" /> },
          { path: '/perfil/:username', element: <PlaceholderPage title="Perfil" /> },
          { path: '/perfil/editar', element: <PlaceholderPage title="Editar perfil" /> },
          {
            path: '/perfil/:username/seguidores',
            element: <PlaceholderPage title="Seguidores" />,
          },
          {
            path: '/perfil/:username/seguindo',
            element: <PlaceholderPage title="Seguindo" />,
          },
          { path: '/livros/:livroId', element: <PlaceholderPage title="Livro" /> },
          { path: '/buscar-livro', element: <PlaceholderPage title="Buscar livro" /> },
          { path: '/estante', element: <PlaceholderPage title="Estante" /> },
          { path: '/estatisticas', element: <PlaceholderPage title="Estatísticas" /> },
          {
            path: '/estatisticas/relatorio-anual',
            element: <PlaceholderPage title="Relatório anual" />,
          },
          { path: '/meta-leitura', element: <PlaceholderPage title="Meta de leitura" /> },
          { path: '/configuracoes', element: <PlaceholderPage title="Configurações" /> },
        ],
      },
      {
        element: <RequireRole papel="administrador" />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: '/admin', element: <PlaceholderPage title="Painel administrativo" /> },
              { path: '/admin/catalogo', element: <PlaceholderPage title="Catálogo" /> },
              { path: '/admin/usuarios', element: <PlaceholderPage title="Usuários" /> },
              {
                path: '/admin/configuracoes',
                element: <PlaceholderPage title="Configurações administrativas" />,
              },
            ],
          },
        ],
      },
    ],
  },
]

export { routeConfig }
