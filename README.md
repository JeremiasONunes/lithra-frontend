# Lythra — Front-end

Front-end do Lythra, rede social de leitura — projeto integrador didático (SENAC). Fase atual:
**mockada**, sem back-end real. Arquitetura, stack e convenções documentadas em
`../docs/01-arquitetura-frontend.md`; roadmap por etapas em `../docs/02-plano-mestre.md`, executado
com o prompt reutilizável em `../docs/03-prompt-execucao-etapas.md`.

## Stack

React 18 + Vite + JavaScript + React Router DOM + CSS puro/CSS Modules + React Hook Form + Zod +
Context API + Lucide React. Sem TypeScript, sem Tailwind, sem Shadcn/UI, sem TanStack Query —
decisão deliberada de simplicidade, ver `../docs/01-arquitetura-frontend.md`.

## Estrutura de pastas

Pastas organizadas **por tipo de arquivo**, não por módulo de produto (sem Feature-First) — detalhe
completo e justificativa em `../docs/01-arquitetura-frontend.md`.

```
src/
  assets/       imagens/SVGs importados pelo código
  components/   componentes de UI reutilizáveis (um `.jsx` + um `.module.css` por componente)
  context/      Contextos React (Provider + hook de consumo no mesmo arquivo)
  hooks/        hooks próprios que ligam páginas a services
  pages/        uma página por rota
  routes/       configuração do React Router + guards de autenticação/papel
  services/     funções que leem/escrevem no `localStorage` (fixture + funções por entidade)
  styles/
    tokens/     tokens de design (cópia de `Lythra Design System/tokens/*.css`, a partir da Etapa 3)
  App.jsx       composição raiz (providers + router)
  main.jsx      ponto de entrada, injeta App no DOM
  index.css     importa os tokens + estilos globais mínimos
```

### Convenção de nomes

| Tipo       | Convenção                                                                           | Exemplo                                       |
| ---------- | ----------------------------------------------------------------------------------- | --------------------------------------------- |
| Componente | `PascalCase.jsx` + `PascalCase.module.css` colocados juntos                         | `BookCard.jsx` / `BookCard.module.css`        |
| Hook       | `useCamelCase.js`                                                                   | `useLivros.js`                                |
| Service    | `entidadeService.js`, sempre funções nomeadas exportadas, nunca um objeto-namespace | `livroService.js`                             |
| Página     | `PascalCase.jsx` dentro de `pages/`                                                 | `LoginPage.jsx`                               |
| Teste      | colocado junto do arquivo testado                                                   | `BookCard.test.jsx` ao lado de `BookCard.jsx` |

## Scripts

| Script                 | O que faz                                              |
| ---------------------- | ------------------------------------------------------ |
| `npm run dev`          | Sobe o servidor de desenvolvimento (Vite)              |
| `npm run build`        | Build de produção                                      |
| `npm run preview`      | Serve o build de produção localmente para conferência  |
| `npm run lint`         | Lint do projeto (ESLint)                               |
| `npm run format`       | Formata todo o projeto (Prettier)                      |
| `npm run format:check` | Verifica formatação sem alterar arquivos (usado em CI) |
| `npm run test`         | Roda a suíte de testes uma vez (Vitest)                |
| `npm run test:watch`   | Roda a suíte de testes em modo watch                   |

## Estado do projeto

Este é o estado da **Etapa 2** do roadmap (Estrutura de Pastas e Convenções): fundação de ferramentas
e pastas prontas, sem design system, sem rotas e sem funcionalidade de produto — tudo isso vem nas
etapas seguintes, documentadas no roadmap.
