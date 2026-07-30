import styles from '../styles/components/ShelfFilterByGenre.module.css'

/**
 * Filtro de gênero — `<select>` nativo, sem componente de dropdown próprio (nenhuma etapa anterior
 * criou um `Select`, mesma decisão de simplicidade já usada pro checkbox de termos na Etapa 9).
 * Opções vêm da própria página (gêneros presentes nos itens da aba de status atual); sem opções,
 * o filtro nem aparece.
 * @param {{ generos: string[], generoSelecionado: string, onChange: (genero: string) => void }} props
 */
function ShelfFilterByGenre({ generos, generoSelecionado, onChange }) {
  if (generos.length === 0) return null

  return (
    <div className={styles.wrapper}>
      <label htmlFor="filtro-genero" className={styles.label}>
        Gênero
      </label>
      <select
        id="filtro-genero"
        className={styles.select}
        value={generoSelecionado}
        onChange={(evento) => onChange(evento.target.value)}
      >
        <option value="">Todos</option>
        {generos.map((genero) => (
          <option key={genero} value={genero}>
            {genero}
          </option>
        ))}
      </select>
    </div>
  )
}

export { ShelfFilterByGenre }
