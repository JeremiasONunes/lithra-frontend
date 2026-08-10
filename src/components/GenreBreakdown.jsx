import { useState } from 'react'
import { Link } from 'react-router-dom'

import { BookCoverThumb } from './BookCoverThumb'
import { Card } from './Card'
import { ProgressBar } from './ProgressBar'
import { RatingStars } from './RatingStars'
import styles from '../styles/components/GenreBreakdown.module.css'

/**
 * Distribuição de livros lidos por gênero — reaproveita `ProgressBar` (Etapa 4) por linha, uma pra
 * cada gênero (`value` = quantidade daquele gênero, `max` = total lido), em vez de um componente de
 * barra novo — mesmo raciocínio já usado em Descobrir (Etapa 15) pra `BookSearchResults`.
 *
 * Cada linha é clicável (a pedido do responsável do projeto, revisão pós-aprovação da Etapa 17):
 * abre/fecha, embaixo da própria barra, a lista dos livros lidos daquele gênero. Cada livro mostra
 * capa, título, autor, número de páginas e "minha avaliação" (`RatingStars` só-leitura, se o próprio
 * usuário já avaliou aquele livro — `minhaNota`, anexado por `agregarEstatisticasDeLeitura`) — lista
 * em linhas (não grade de miniaturas) de propósito, pra caber esses detalhes com respiro (pedido
 * explícito do responsável do projeto: "mais espaço entre os livros").
 *
 * `distribucaoPorGenero` já vem com `livros` resolvidos (`useReadingStats`), não precisa de outro
 * cruzamento aqui. Só um gênero aberto por vez (`generoAberto`, não um Set) — mesma simplicidade de
 * outros painéis do projeto que só têm um item expandido por vez.
 * @param {{
 *   distribucaoPorGenero: { genero: string, quantidade: number, livros: object[] }[],
 *   total: number,
 * }} props
 */
function GenreBreakdown({ distribucaoPorGenero, total }) {
  const [generoAberto, setGeneroAberto] = useState(null)

  return (
    <Card className={styles.card}>
      <h2 className={styles.titulo}>Por gênero</h2>
      <ul className={styles.lista}>
        {distribucaoPorGenero.map((linha) => {
          const aberto = linha.genero === generoAberto

          return (
            <li key={linha.genero}>
              <button
                type="button"
                className={styles.linha}
                onClick={() => setGeneroAberto(aberto ? null : linha.genero)}
                aria-expanded={aberto}
                aria-label={`${linha.genero}, ${linha.quantidade} ${linha.quantidade === 1 ? 'livro lido' : 'livros lidos'}. ${aberto ? 'Ocultar' : 'Ver'} lista de livros.`}
              >
                <ProgressBar
                  label={`${linha.genero} (${linha.quantidade})`}
                  value={linha.quantidade}
                  max={total}
                />
              </button>
              {aberto ? (
                <ul className={styles.livros}>
                  {linha.livros.map((livro) => (
                    <li key={livro.id}>
                      <Link to={`/livros/${livro.id}`} className={styles.livroItem}>
                        <BookCoverThumb src={livro.capaUrl} title={livro.titulo} size="sm" />
                        <div className={styles.livroInfo}>
                          <span className={styles.livroTitulo}>{livro.titulo}</span>
                          <span className={styles.livroAutor}>{livro.autor}</span>
                          <span className={styles.livroPaginas}>{livro.numeroPaginas} páginas</span>
                          {livro.minhaNota ? (
                            <span className={styles.minhaAvaliacao}>
                              <RatingStars value={livro.minhaNota} size={14} />
                            </span>
                          ) : (
                            <span className={styles.semAvaliacao}>Você ainda não avaliou</span>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

export { GenreBreakdown }
