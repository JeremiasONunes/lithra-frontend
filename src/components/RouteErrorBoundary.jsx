import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

import { Card } from './Card'
import styles from '../styles/components/RouteErrorBoundary.module.css'

/** Capturado pelo `errorElement` do React Router — erro de render/loader dentro de qualquer rota,
 * não confundir com a página 404 (essa é uma rota normal, `PlaceholderPage` em `*`). */
function RouteErrorBoundary() {
  const error = useRouteError()
  const mensagem = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : error?.message || 'Erro inesperado.'

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <h1 className={styles.title}>Algo deu errado</h1>
        <p>{mensagem}</p>
      </Card>
    </div>
  )
}

export { RouteErrorBoundary }
