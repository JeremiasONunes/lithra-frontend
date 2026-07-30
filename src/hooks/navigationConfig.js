import {
  BarChart2,
  Bookmark,
  Compass,
  Home,
  LayoutDashboard,
  Library,
  Search,
  Settings,
  Users,
} from 'lucide-react'

/**
 * Fonte única dos itens de navegação por papel — nunca hard-coded duas vezes. Usado só por
 * `useNavigationItems.js`; colocado em `hooks/` (não `services/`, não `components/`) por estar
 * amarrado só a esse hook, mesmo raciocínio de `mockStorage.js` em `services/` (utilitário de apoio
 * a um conjunto de arquivos da mesma pasta, sem ser ele próprio um service/hook completo).
 */
const NAVEGACAO_POR_PAPEL = {
  leitor: [
    { rota: '/feed', rotulo: 'Feed', icon: Home },
    { rota: '/descobrir', rotulo: 'Descobrir', icon: Compass },
    { rota: '/buscar-livro', rotulo: 'Buscar Livro', icon: Search },
    { rota: '/estante', rotulo: 'Estante', icon: Bookmark },
    { rota: '/estatisticas', rotulo: 'Estatísticas', icon: BarChart2 },
  ],
  administrador: [
    // `exato: true` — sem isso, o `NavLink` de "/admin" também fica marcado como ativo em
    // "/admin/catalogo" etc. (a rota é prefixo literal das outras), duas entradas "selecionadas" ao
    // mesmo tempo. As demais rotas não precisam disso: nenhuma é prefixo de outro item do menu.
    { rota: '/admin', rotulo: 'Dashboard', icon: LayoutDashboard, exato: true },
    { rota: '/admin/catalogo', rotulo: 'Catálogo', icon: Library },
    { rota: '/admin/usuarios', rotulo: 'Usuários', icon: Users },
    { rota: '/admin/configuracoes', rotulo: 'Configurações', icon: Settings },
  ],
}

export { NAVEGACAO_POR_PAPEL }
