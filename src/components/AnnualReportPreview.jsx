import { Download } from 'lucide-react'

import { Button } from './Button'
import { Card } from './Card'
import styles from '../styles/components/AnnualReportPreview.module.css'

/**
 * Prévia do Relatório Anual (#17) — 4 blocos (livros lidos, páginas lidas, gênero favorito, autor
 * mais lido; os 2 últimos vêm de `agregarEstatisticasDeLeitura`, mesma função de `useReadingStats`,
 * Etapa 17). "Exportar em PDF" é real, não simulado: `window.print()` (impressão nativa do
 * navegador, sem biblioteca de geração de PDF) — quem exporta escolhe "Salvar como PDF" no diálogo
 * do próprio navegador. O botão some do próprio resultado impresso (`.somenteNaTela`, `@media
 * print`).
 * @param {{ estatisticas: object, onExportar: () => void }} props
 */
function AnnualReportPreview({ estatisticas, onExportar }) {
  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <div className={styles.grade}>
          <div className={styles.bloco}>
            <span className={styles.rotulo}>Livros lidos</span>
            <span className={styles.valor}>{estatisticas.totalLivrosLidos}</span>
          </div>
          <div className={styles.bloco}>
            <span className={styles.rotulo}>Páginas lidas</span>
            <span className={styles.valor}>{estatisticas.totalPaginasLidas}</span>
          </div>
          <div className={styles.bloco}>
            <span className={styles.rotulo}>Gênero favorito</span>
            <span className={styles.valorTexto}>{estatisticas.generoFavorito ?? '—'}</span>
          </div>
          <div className={styles.bloco}>
            <span className={styles.rotulo}>Autor mais lido</span>
            <span className={styles.valorTexto}>{estatisticas.autorMaisLido ?? '—'}</span>
          </div>
        </div>
      </Card>
      <Button variant="primary" onClick={onExportar} className={styles.somenteNaTela}>
        <Download size={18} aria-hidden="true" />
        Exportar em PDF
      </Button>
    </div>
  )
}

export { AnnualReportPreview }
