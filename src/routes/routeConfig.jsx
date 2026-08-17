import { AdminLayout } from '../components/AdminLayout'
import { PublicLayout } from '../components/PublicLayout'
import { ReaderLayout } from '../components/ReaderLayout'
import { RouteErrorBoundary } from '../components/RouteErrorBoundary'
import { AcessoNaoAutorizadoPage } from '../pages/AcessoNaoAutorizadoPage'
import { AdminCatalogPage } from '../pages/AdminCatalogPage'
import { AdminDashboardPage } from '../pages/AdminDashboardPage'
import { AdminSettingsPage } from '../pages/AdminSettingsPage'
import { AdminUsersPage } from '../pages/AdminUsersPage'
import { BookPage } from '../pages/BookPage'
import { BuscarLivroPage } from '../pages/BuscarLivroPage'
import { BuscaPage } from '../pages/BuscaPage'
import { CadastroPage } from '../pages/CadastroPage'
import { ConfiguracoesPage } from '../pages/ConfiguracoesPage'
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
 * feature. `/`, `/login`, `/cadastro`, `/recuperar-senha` (Etapa 9), `/nao-autorizado` (Etapa 10),
 * `*` (Etapa 11), `/livros/:livroId`/`/buscar-livro` (Etapa 12), `/estante` (Etapa 13), `/feed`
 * (Etapa 14), `/descobrir`/`/busca`/`/recomendados` (Etapa 15), `/perfil/:username` (tratado como
 * `usuario.id`, não um campo `username` próprio)/`/perfil/editar`/`/perfil/:username/seguidores`/
 * `/perfil/:username/seguindo` (Etapa 16), `/estatisticas`/`/estatisticas/relatorio-anual`/
 * `/meta-leitura` (Etapa 17), `/configuracoes` (Etapa 18) e `/admin`/`/admin/catalogo`/
 * `/admin/usuarios`/`/admin/configuracoes` (Etapa 19) já ganharam a tela final — as 24 telas de
 * produto (Fases 1-3) estão completas; só restam as etapas de qualidade transversal (20-22).
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
          { path: '/configuracoes', element: <ConfiguracoesPage /> },
        ],
      },
      {
        element: <RequireRole papel="administrador" />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: '/admin', element: <AdminDashboardPage /> },
              { path: '/admin/catalogo', element: <AdminCatalogPage /> },
              { path: '/admin/usuarios', element: <AdminUsersPage /> },
              { path: '/admin/configuracoes', element: <AdminSettingsPage /> },
            ],
          },
        ],
      },
    ],
  },
]

export { routeConfig }
