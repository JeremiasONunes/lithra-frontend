import { ProgressBar } from './ProgressBar'

/**
 * `ProgressBar` (Etapa 4) parametrizada por página atual/total — calcula o rótulo padrão
 * "Página X de Y" já usado no `Lythra Design System` (tela Estante).
 * @param {{ paginaAtual: number, paginaTotal: number }} props
 */
function ReadingProgressBar({ paginaAtual, paginaTotal }) {
  return (
    <ProgressBar
      value={paginaAtual}
      max={paginaTotal}
      label={`Página ${paginaAtual} de ${paginaTotal}`}
    />
  )
}

export { ReadingProgressBar }
