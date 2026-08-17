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

/*
 * TEORIA: ROTA COMO DADO — CADA OBJETO É UM NÓ NUMA ÁRVORE
 * ---------------------------------------------------------------------------
 * Cada `{ path, element, children }` abaixo é um NÓ de rota. `path` é o
 * pedaço de URL que aquele nó consome (ex.: `/feed`); `element` é o
 * componente React renderizado quando aquele caminho é alcançado;
 * `children` são rotas ANINHADAS por dentro dele. React Router monta essa
 * árvore de objetos e, a cada mudança de URL, decide qual é o "caminho" de
 * nós (da raiz até a folha) que corresponde — e renderiza o `element` de
 * CADA nó desse caminho, um dentro do outro.
 *
 * TEORIA: `<Outlet />` — COMO UM NÓ PAI "ENCAIXA" O FILHO DENTRO DE SI
 * ---------------------------------------------------------------------------
 * Um `element` de rota que tem `children` normalmente contém, em algum
 * lugar do seu JSX, um `<Outlet />` (ver `PublicLayout`/`ReaderLayout`/
 * `AdminLayout`/os dois guards) — é ali que o `element` do FILHO ativo é
 * inserido. É assim que `PublicLayout` consegue renderizar `<AuthHeader />`
 * uma vez só e trocar só o conteúdo abaixo dele conforme a rota
 * (`LandingPage`, `LoginPage`...) sem duplicar o cabeçalho em cada página.
 *
 * TEORIA: ROTA SEM `path` = "ROTA DE LAYOUT/GUARDA", NÃO CONSOME URL
 * ---------------------------------------------------------------------------
 * Repare que `PublicLayout`, `RequireAuth`, `ReaderLayout`, `RequireRole` e
 * `AdminLayout` aparecem como `{ element: <X />, children: [...] }`, SEM
 * nenhum `path`. Uma rota sem `path` não corresponde a nenhum pedaço de
 * URL — ela só EXISTE pra envolver seus filhos com alguma coisa (um layout
 * visual, ou, no caso de `RequireAuth`/`RequireRole`, uma VERIFICAÇÃO antes
 * de deixar os filhos renderizarem). `RequireAuth`/`RequireRole` usam esse
 * mecanismo pra decidir, a cada navegação, entre renderizar `<Outlet />`
 * (deixa passar) ou `<Navigate to="..." />` (redireciona) — ver os dois
 * guards em `routes/guards/`.
 *
 * A ÁRVORE DE PROTEÇÃO DESTE PROJETO, EM PALAVRAS
 * ---------------------------------------------------------------------------
 * `RequireAuth` embrulha DOIS ramos irmãos ao mesmo tempo: as rotas de
 * `ReaderLayout` e o ramo que leva a `RequireRole`/`AdminLayout`. Isso
 * significa: TODA rota autenticada (seja de Leitor ou de Administrador)
 * primeiro passa pela pergunta "existe sessão?" (`RequireAuth`). As rotas
 * de `ReaderLayout` não fazem nenhuma pergunta extra depois disso — qualquer
 * pessoa logada, leitora ou administradora, pode acessá-las. Só o ramo de
 * `/admin/*` faz uma SEGUNDA pergunta, aninhada dentro da primeira:
 * "o papel é administrador?" (`RequireRole`). Dois guards empilhados, cada
 * um resolvendo uma pergunta — nunca um guard só tentando cobrir os dois
 * casos com `if`s internos.
 *
 * SEGMENTOS DINÂMICOS (`:livroId`, `:username`)
 * ---------------------------------------------------------------------------
 * Um pedaço de `path` começando com `:` (ex.: `/livros/:livroId`) é um
 * PARÂMETRO DE ROTA — casa com qualquer valor naquele pedaço da URL
 * (`/livros/livro-1`, `/livros/livro-42`...) e disponibiliza esse valor pro
 * componente renderizado via o hook `useParams()` do React Router. É assim
 * que uma ÚNICA definição de rota (`BookPage`) serve pra qualquer livro do
 * catálogo, sem precisar de uma rota escrita à mão por livro.
 *
 * `*` — A ROTA "PEGA-TUDO" (CATCH-ALL)
 * ---------------------------------------------------------------------------
 * `{ path: '*', element: <NotFoundPage /> }` casa com QUALQUER URL que não
 * bateu com nenhuma rota anterior na mesma lista de `children` — React
 * Router tenta as rotas mais específicas primeiro; `*` é sempre a última
 * alternativa, o equivalente de um `default` num `switch`.
 *
 * ---------------------------------------------------------------------------
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
    // Ramo público — qualquer visitante, com ou sem sessão, acessa livremente.
    element: <PublicLayout />,
    // `errorElement`: se QUALQUER componente deste ramo lançar um erro durante a renderização,
    // React Router captura e renderiza isto no lugar, em vez de a tela inteira quebrar em branco —
    // o mesmo papel de um Error Boundary do React, só que já integrado ao roteador.
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
    // Ramo autenticado — `RequireAuth` (sem `path`) decide, antes de qualquer filho renderizar, se
    // existe sessão válida. Ver a teoria completa da árvore de proteção no topo do arquivo.
    element: <RequireAuth />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        // Layout do papel Leitor — qualquer usuário autenticado (Leitor OU Administrador) acessa;
        // não há um segundo guard aqui, só o de `RequireAuth` já satisfeito.
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
            // Mesma página (`FollowListPage`) serve pras 2 rotas de seguidores/seguindo — só a prop
            // `tipo` muda entre elas, evitando duplicar um componente quase idêntico duas vezes.
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
        // Segundo guard, ANINHADO dentro do primeiro — só é alcançado depois que `RequireAuth` já
        // deixou passar; aqui a pergunta extra é "o papel é administrador?".
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
