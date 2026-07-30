import { Button } from './Button'
import { Input } from './Input'
import styles from '../styles/components/BookSearchBar.module.css'

/**
 * Busca é disparada só na submissão (não a cada tecla) — `value`/`onChange` controlados por quem
 * chama, que também decide quando de fato buscar (`onSubmit`). Um único campo cobre título, autor e
 * gênero (`livroService.buscarPorTitulo` já busca nos três).
 * @param {{ value: string, onChange: (valor: string) => void, onSubmit: (evento: Event) => void }} props
 */
function BookSearchBar({ value, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className={styles.formulario}>
      <Input
        value={value}
        onChange={(evento) => onChange(evento.target.value)}
        placeholder="Buscar por título, autor ou gênero"
        aria-label="Buscar por título, autor ou gênero"
      />
      <Button type="submit" variant="primary">
        Buscar
      </Button>
    </form>
  )
}

export { BookSearchBar }
