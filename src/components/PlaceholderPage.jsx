import { Card } from './Card'
import styles from '../styles/components/PlaceholderPage.module.css'

/** Conteúdo genérico de toda rota do produto ainda não implementada. Cada etapa futura (9, 10,
 * 12-19) substitui o `<PlaceholderPage>` da rota correspondente pela tela real dentro de
 * `routes/AppRoutes.jsx`, sem precisar mexer na árvore de rotas em si. */
function PlaceholderPage({ title, description = 'Esta tela ainda não foi implementada.' }) {
  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <h1 className={styles.title}>{title}</h1>
        <p>{description}</p>
      </Card>
    </div>
  )
}

export { PlaceholderPage }
