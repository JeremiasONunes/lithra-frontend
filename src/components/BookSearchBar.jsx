import { Button } from './Button'
import { Input } from './Input'
import styles from '../styles/components/BookSearchBar.module.css'

/**
 * Busca é disparada só na submissão (não a cada tecla) — `value`/`onChange` controlados por quem
 * chama, que também decide quando de fato buscar (`onSubmit`). Um único campo cobre título, autor e
 * gênero (`livroService.buscarPorTitulo` já busca nos três).
 *
 * `placeholder` opcional (Etapa 15: mesmo componente reaproveitado pela Busca unificada, que
 * também busca leitores, não só livros) — usa o mesmo texto pra `placeholder`/`aria-label`, já que
 * sempre foram idênticos aqui. Default preserva o texto original (`/buscar-livro`, Etapa 12).
 * @param {{
 *   value: string,
 *   onChange: (valor: string) => void,
 *   onSubmit: (evento: Event) => void,
 *   placeholder?: string,
 * }} props
 */
function BookSearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Buscar por título, autor ou gênero',
}) {
  return (
    <form onSubmit={onSubmit} className={styles.formulario}>
      <Input
        value={value}
        onChange={(evento) => onChange(evento.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      <Button type="submit" variant="primary">
        Buscar
      </Button>
    </form>
  )
}

export { BookSearchBar }
