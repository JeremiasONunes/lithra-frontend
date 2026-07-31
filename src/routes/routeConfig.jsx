import { AdminLayout } from '../components/AdminLayout'
import { PlaceholderPage } from '../components/PlaceholderPage'
import { PublicLayout } from '../components/PublicLayout'
import { ReaderLayout } from '../components/ReaderLayout'
import { RouteErrorBoundary } from '../components/RouteErrorBoundary'
import { AcessoNaoAutorizadoPage } from '../pages/AcessoNaoAutorizadoPage'
import { BookPage } from '../pages/BookPage'
import { BuscarLivroPage } from '../pages/BuscarLivroPage'
import { CadastroPage } from '../pages/CadastroPage'
import { EstantePage } from '../pages/EstantePage'
import { FeedPage } from '../pages/FeedPage'
import { LandingPage } from '../pages/LandingPage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { RecuperarSenhaPage } from '../pages/RecuperarSenhaPage'
import { RequireAuth } from './guards/RequireAuth'
import { RequireRole } from './guards/RequireRole'

/**
 * Toda a árvore de rotas do produto, declarada num só lugar — nenhuma rota "pertence" a uma
 * feature. Cada rota ainda não implementada aponta pra `PlaceholderPage`; etapas futuras (15-19)
 * substituem só o `element` da rota correspondente pela tela real, sem tocar na estrutura da árvore
 * — `/`, `/login`, `/cadastro`, `/recuperar-senha` (Etapa 9), `/nao-autorizado` (Etapa 10), `*`
 * (Etapa 11), `/livros/:livroId`/`/buscar-livro` (Etapa 12), `/estante` (Etapa 13) e `/feed`
 * (Etapa 14) já ganharam a tela final.
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
      { path: '/', element: <LandingPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/cadastro', element: <CadastroPage /> },
      { path: '/recuperar-senha', element: <RecuperarSenhaPage /> },
      { path: '/nao-autorizado', element: <AcessoNaoAutorizadoPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <ReaderLayout />,
        children: [
          { path: '/feed', element: <FeedPage /> },
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
          { path: '/livros/:livroId', element: <BookPage /> },
          { path: '/buscar-livro', element: <BuscarLivroPage /> },
          { path: '/estante', element: <EstantePage /> },
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
