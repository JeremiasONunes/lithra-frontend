import { AdminLayout } from '../components/AdminLayout'
import { PlaceholderPage } from '../components/PlaceholderPage'
import { PublicLayout } from '../components/PublicLayout'
import { ReaderLayout } from '../components/ReaderLayout'
import { RouteErrorBoundary } from '../components/RouteErrorBoundary'
import { AcessoNaoAutorizadoPage } from '../pages/AcessoNaoAutorizadoPage'
import { BookPage } from '../pages/BookPage'
import { BuscarLivroPage } from '../pages/BuscarLivroPage'
import { BuscaPage } from '../pages/BuscaPage'
import { CadastroPage } from '../pages/CadastroPage'
import { DescobrirPage } from '../pages/DescobrirPage'
import { EditarPerfilPage } from '../pages/EditarPerfilPage'
import { EstantePage } from '../pages/EstantePage'
import { EstatisticasPage } from '../pages/EstatisticasPage'
import { FeedPage } from '../pages/FeedPage'
import { FollowListPage } from '../pages/FollowListPage'
import { LandingPage } from '../pages/LandingPage'
import { LoginPage } from '../pages/LoginPage'
import { MetaLeituraPage } from '../pages/MetaLeituraPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProfilePage } from '../pages/ProfilePage'
import { RecomendadosPage } from '../pages/RecomendadosPage'
import { RecuperarSenhaPage } from '../pages/RecuperarSenhaPage'
import { RelatorioAnualPage } from '../pages/RelatorioAnualPage'
import { RequireAuth } from './guards/RequireAuth'
import { RequireRole } from './guards/RequireRole'

/**
 * Toda a árvore de rotas do produto, declarada num só lugar — nenhuma rota "pertence" a uma
 * feature. Cada rota ainda não implementada aponta pra `PlaceholderPage`; etapas futuras (18-19)
 * substituem só o `element` da rota correspondente pela tela real, sem tocar na estrutura da árvore
 * — `/`, `/login`, `/cadastro`, `/recuperar-senha` (Etapa 9), `/nao-autorizado` (Etapa 10), `*`
 * (Etapa 11), `/livros/:livroId`/`/buscar-livro` (Etapa 12), `/estante` (Etapa 13), `/feed`
 * (Etapa 14), `/descobrir`/`/busca`/`/recomendados` (Etapa 15), `/perfil/:username` (tratado como
 * `usuario.id`, não um campo `username` próprio)/`/perfil/editar`/`/perfil/:username/seguidores`/
 * `/perfil/:username/seguindo` (Etapa 16) e `/estatisticas`/`/estatisticas/relatorio-anual`/
 * `/meta-leitura` (Etapa 17) já ganharam a tela final.
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
          { path: '/descobrir', element: <DescobrirPage /> },
          { path: '/busca', element: <BuscaPage /> },
          { path: '/recomendados', element: <RecomendadosPage /> },
          { path: '/perfil/:username', element: <ProfilePage /> },
          { path: '/perfil/editar', element: <EditarPerfilPage /> },
          {
            path: '/perfil/:username/seguidores',
            element: <FollowListPage tipo="seguidores" />,
          },
          {
            path: '/perfil/:username/seguindo',
            element: <FollowListPage tipo="seguindo" />,
          },
          { path: '/livros/:livroId', element: <BookPage /> },
          { path: '/buscar-livro', element: <BuscarLivroPage /> },
          { path: '/estante', element: <EstantePage /> },
          { path: '/estatisticas', element: <EstatisticasPage /> },
          {
            path: '/estatisticas/relatorio-anual',
            element: <RelatorioAnualPage />,
          },
          { path: '/meta-leitura', element: <MetaLeituraPage /> },
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
