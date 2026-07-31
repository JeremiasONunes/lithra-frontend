import { Link } from 'react-router-dom'

import { Badge } from './Badge'
import { BookSearchResults } from './BookSearchResults'
import { UserAvatar } from './UserAvatar'
import styles from '../styles/components/UnifiedSearchResults.module.css'

/**
 * Seções separadas Livros/Leitores (Critério de Aceite da Etapa 15) — livros reaproveita
 * `BookSearchResults` (Etapa 12) direto, mesma grade de capas, sem duplicar; leitores é uma lista
 * própria (avatar + nome + bio), sem ação de seguir — `FollowButton` é componente da Etapa 16
 * (perfil/rede de seguidores), fora do escopo desta etapa; aqui só mostra o resultado.
 *
 * Cada seção só aparece se tiver resultado; o estado "nada em nenhuma das duas" é responsabilidade
 * de quem chama (`BuscaPage`, via `PageStateBoundary`), não deste componente.
 * @param {{ livros: object[], leitores: object[] }} props
 */
function UnifiedSearchResults({ livros, leitores }) {
  return (
    <div className={styles.wrapper}>
      {livros.length > 0 ? (
        <section className={styles.secao}>
          <Badge tone="secondary">Livros</Badge>
          <BookSearchResults resultados={livros} />
        </section>
      ) : null}

      {leitores.length > 0 ? (
        <section className={styles.secao}>
          <Badge tone="primary">Leitores</Badge>
          <ul className={styles.listaLeitores}>
            {leitores.map((leitor) => (
              <li key={leitor.id}>
                <Link to={`/perfil/${leitor.id}`} className={styles.leitorItem}>
                  <UserAvatar name={leitor.nome} src={leitor.fotoUrl} size="md" />
                  <div className={styles.leitorInfo}>
                    <span className={styles.leitorNome}>{leitor.nome}</span>
                    {leitor.bio ? <span className={styles.leitorBio}>{leitor.bio}</span> : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

export { UnifiedSearchResults }
