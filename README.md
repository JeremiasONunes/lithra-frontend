# Lythra — Front-end

Front-end do Lythra, rede social de leitura — projeto integrador didático (SENAC). Fase atual:
**mockada**, sem back-end real. Arquitetura, stack e convenções documentadas em
`../docs/01-arquitetura-frontend.md`; roadmap por etapas em `../docs/02-plano-mestre.md`, executado
com o prompt reutilizável em `../docs/03-prompt-execucao-etapas.md`.

## Stack

React 18 + Vite + JavaScript + React Router DOM + CSS puro/CSS Modules + React Hook Form + Zod +
Context API + Lucide React. Sem TypeScript, sem Tailwind, sem Shadcn/UI, sem TanStack Query —
decisão deliberada de simplicidade, ver `../docs/01-arquitetura-frontend.md`.

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

Este é o estado da **Etapa 1** do roadmap (Inicialização do Projeto e Ferramentas de Base): apenas
fundação de ferramentas, sem estrutura de pastas de produto, sem design system, sem rotas e sem
funcionalidade de produto — tudo isso vem nas etapas seguintes, documentadas no roadmap.
