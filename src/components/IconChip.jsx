import styles from '../styles/components/IconChip.module.css'

const DIMENSOES = { sm: 32, md: 40, lg: 48 }

/**
 * Ícone Lucide dentro de um círculo clay colorido.
 * @param {{
 *   icon: import('react').ComponentType,
 *   tone?: 'surface' | 'primary' | 'secondary' | 'accent',
 *   size?: 'sm' | 'md' | 'lg',
 *   label?: string,
 * }} props `icon` é o componente do ícone (ex.: `icon={BookOpen}`, de `lucide-react`), não uma
 * string de nome — este projeto não usa um wrapper de ícone por nome. `label` só é necessário
 * quando o chip carrega significado sozinho, sem texto visível ao lado; do contrário o ícone fica
 * `aria-hidden`.
 */
function IconChip({ icon: Icon, tone = 'surface', size = 'md', label }) {
  const dimensao = DIMENSOES[size]

  return (
    <span
      className={`${styles.chip} ${styles[tone]}`}
      style={{ width: dimensao, height: dimensao }}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <Icon size={dimensao * 0.45} aria-hidden="true" />
    </span>
  )
}

export { IconChip }
