import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // `01-arquitetura-frontend.md` fixa "Provider + hook de consumo no mesmo arquivo" como
    // convenção de `context/` — sem isto, `react-refresh/only-export-components` barra esse
    // padrão (só permite exportar componentes). Escopo restrito a `context/` para não afrouxar a
    // regra no resto do projeto (`components/`, `hooks/` etc. continuam com um export só).
    files: ['src/context/**/*.jsx'],
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowExportNames: ['useAuth', 'useUILayout'] },
      ],
    },
  },
])
