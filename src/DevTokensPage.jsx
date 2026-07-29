import styles from './styles/DevTokensPage.module.css'

/**
 * Página temporária de conferência visual dos tokens (Etapa 3) — não é produto, é diagnóstico
 * descartável, removido antes da Etapa 22. Sem React Router ainda (só nasce na Etapa 5): ativada por
 * uma checagem simples de `window.location.pathname` em `main.jsx`, não por rota real.
 *
 * Sem componentes de `components/` ainda (só nascem na Etapa 4) — esta página usa estilo próprio
 * (`DevTokensPage.module.css`) e `style` inline pontual só onde o valor é dinâmico (o nome do token
 * sendo percorrido), nunca um valor de cor/raio/sombra escrito na mão.
 */

const colorTokens = [
  { name: 'background', on: 'on-surface' },
  { name: 'surface', on: 'on-surface' },
  { name: 'surface-raised', on: 'on-surface' },
  { name: 'primary', on: 'on-primary' },
  { name: 'primary-pressed', on: 'on-primary' },
  { name: 'secondary', on: 'on-secondary' },
  { name: 'accent', on: 'on-accent' },
  { name: 'success', on: 'on-success' },
  { name: 'warning', on: 'on-warning' },
  { name: 'danger', on: 'on-danger' },
]

const typeSizes = [
  'text-xs',
  'text-sm',
  'text-base',
  'text-md',
  'text-lg',
  'text-xl',
  'text-2xl',
  'text-3xl',
]

const spaceTokens = [
  'space-1',
  'space-2',
  'space-3',
  'space-4',
  'space-6',
  'space-8',
  'space-12',
  'space-20',
]

const radiusTokens = ['radius-clay-sm', 'radius-clay-md', 'radius-clay-lg', 'radius-clay-full']

const shadowTokens = [
  'shadow-clay-sm',
  'shadow-clay-md',
  'shadow-clay-lg',
  'shadow-clay-pressed',
  'shadow-clay-inset',
]

function DevTokensPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Lythra — Conferência de Tokens (Etapa 3)</h1>
      <p className={styles.subtitle}>
        Página temporária, não faz parte do produto final. Removida antes da Etapa 22.
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Cores</h2>
        <div className={styles.grid}>
          {colorTokens.map((token) => (
            <div
              key={token.name}
              className={styles.swatch}
              style={{ background: `var(--${token.name})`, color: `var(--${token.on})` }}
            >
              --{token.name}
              <br />
              texto --{token.on}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Tipografia</h2>
        {typeSizes.map((size) => (
          <p key={size} className={styles.typeSample} style={{ fontSize: `var(--${size})` }}>
            --{size} — Transforme sua leitura em uma experiência social
          </p>
        ))}
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 'var(--weight-regular)' }}>
          --font-body / --weight-regular (Nunito 400)
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 'var(--weight-bold)' }}>
          --font-body / --weight-bold (Nunito 700)
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Espaçamento</h2>
        {spaceTokens.map((space) => (
          <div key={space} className={styles.spaceRow}>
            <span
              className={styles.spaceBox}
              style={{ width: `var(--${space})`, height: '16px' }}
            />
            --{space}
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Raio</h2>
        <div className={styles.grid}>
          {radiusTokens.map((radius) => (
            <div
              key={radius}
              className={styles.swatch}
              style={{ background: 'var(--surface)', borderRadius: `var(--${radius})` }}
            >
              --{radius}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sombra</h2>
        <div className={styles.grid}>
          {shadowTokens.map((shadow) => (
            <div
              key={shadow}
              className={styles.shadowBox}
              style={{ boxShadow: `var(--${shadow})` }}
            >
              --{shadow}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Breakpoints</h2>
        <ul className={styles.list}>
          <li>--breakpoint-tablet: 768px</li>
          <li>--breakpoint-desktop: 1024px</li>
        </ul>
      </section>
    </main>
  )
}

export default DevTokensPage
