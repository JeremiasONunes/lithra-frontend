import styles from '../styles/components/ShelfStatusTabs.module.css'

const OPCOES = [
  { valor: 'quero-ler', rotulo: 'Quero Ler' },
  { valor: 'lendo', rotulo: 'Lendo' },
  { valor: 'lido', rotulo: 'Lido' },
]

/**
 * As 3 abas de status da estante. `role="tablist"`/`role="tab"`/`aria-selected` — navegação por
 * teclado nativa de botão já cobre o essencial, sem precisar de gerenciamento de foco por seta
 * (mesma simplicidade já aplicada a outros componentes do projeto, ver `RatingStars`, Etapa 6).
 * @param {{ status: 'quero-ler' | 'lendo' | 'lido', onChange: (status: string) => void }} props
 */
function ShelfStatusTabs({ status, onChange }) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Filtrar por status de leitura">
      {OPCOES.map((opcao) => (
        <button
          key={opcao.valor}
          type="button"
          role="tab"
          aria-selected={status === opcao.valor}
          className={`${styles.tab} ${status === opcao.valor ? styles.ativo : ''}`}
          onClick={() => onChange(opcao.valor)}
        >
          {opcao.rotulo}
        </button>
      ))}
    </div>
  )
}

export { ShelfStatusTabs }
