import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { routeConfig } from './routeConfig'

/*
 * TEORIA: `createBrowserRouter` — O "ROTEADOR DE DADOS" DO REACT ROUTER
 * ---------------------------------------------------------------------------
 * O React Router tem duas formas principais de declarar rotas:
 *   1. A forma DECLARATIVA mais antiga: `<BrowserRouter><Routes><Route .../></Routes></BrowserRouter>`,
 *      escrita como JSX dentro da árvore de componentes.
 *   2. A forma "roteador de dados" (usada aqui): `createBrowserRouter(routeConfig)`, onde a árvore de
 *      rotas é um ARRAY DE OBJETOS JAVASCRIPT (`routeConfig.jsx`), não JSX — e um único componente
 *      (`<RouterProvider router={router} />`) recebe esse roteador já pronto.
 * A vantagem prática que motivou essa escolha aqui: como a árvore de rotas é só DADO (um array), ela
 * pode ser criada de duas formas diferentes a partir do MESMO `routeConfig` — `createBrowserRouter`
 * pra rodar de verdade no navegador (lê a URL real, `window.location`), ou `createMemoryRouter` pra
 * testes automatizados (`AppRoutes.test.jsx`), que simula uma URL em memória, sem depender do
 * navegador nem de recarregar página nenhuma. Isso não seria possível se a árvore de rotas estivesse
 * escrita como JSX preso dentro deste componente.
 *
 * `createBrowserRouter` especificamente usa a History API do navegador (a mesma API por trás dos
 * botões voltar/avançar) pra trocar de URL sem recarregar a página inteira — é o que torna a
 * navegação de uma SPA (Single Page Application) instantânea, diferente de um link tradicional que
 * pediria uma página HTML nova ao servidor a cada clique.
 *
 * POR QUE `router` NASCE FORA DO COMPONENTE, NÃO DENTRO DELE
 * ---------------------------------------------------------------------------
 * Se `createBrowserRouter(routeConfig)` fosse chamado DENTRO da função `AppRoutes`, um novo objeto de
 * roteador seria criado a CADA renderização do componente — perdendo qualquer estado interno do
 * roteador entre uma renderização e outra, e recriando o listener de mudança de URL sem necessidade.
 * Criar `router` uma única vez, no escopo do MÓDULO (fora de qualquer função de componente), garante
 * que ele existe uma vez só durante toda a vida do app — o mesmo cuidado que qualquer valor "caro" de
 * se recriar (uma conexão, um roteador, um cliente de API) merece em React.
 */
const router = createBrowserRouter(routeConfig)

/** Ponto de entrada do roteamento — `<RouterProvider>` distribui o roteador (rotas + estado de
 * navegação atual) pra toda a árvore de componentes abaixo dele via Context API por baixo dos panos,
 * é o que permite que `useNavigate`/`useLocation`/`<Link>` funcionem em qualquer componente aninhado,
 * sem precisar passar o roteador manualmente por prop. */
function AppRoutes() {
  return <RouterProvider router={router} />
}

export { AppRoutes }
