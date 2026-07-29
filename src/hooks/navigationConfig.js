import {
  BarChart2,
  Bookmark,
  Compass,
  Home,
  LayoutDashboard,
  Library,
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
    { rota: '/estante', rotulo: 'Estante', icon: Bookmark },
    { rota: '/estatisticas', rotulo: 'Estatísticas', icon: BarChart2 },
  ],
  administrador: [
    { rota: '/admin', rotulo: 'Dashboard', icon: LayoutDashboard },
    { rota: '/admin/catalogo', rotulo: 'Catálogo', icon: Library },
    { rota: '/admin/usuarios', rotulo: 'Usuários', icon: Users },
    { rota: '/admin/configuracoes', rotulo: 'Configurações', icon: Settings },
  ],
}

export { NAVEGACAO_POR_PAPEL }
