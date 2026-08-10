import { Link } from 'react-router-dom'

import { BookCoverThumb } from './BookCoverThumb'
import { ReadingProgressBar } from './ReadingProgressBar'
import styles from '../styles/components/ShelfGrid.module.css'

/**
 * Grade de itens da estante — já filtrados (status/gênero) e cruzados com o livro correspondente
 * (`item.livro`) por quem chama (`EstantePage`/`ProfilePage`), que já precisa desse cruzamento pra
 * outra coisa (opções do filtro de gênero / regra de privacidade). A barra de progresso só aparece
 * pra itens "lendo" (parada em "quero ler"/"lido" não tem página atual significativa, ver
 * `itemDaEstanteService`).
 *
 * `readOnly` (Etapa 16 — "reaproveita `ShelfGrid` em modo somente-leitura quando visitante"):
 * dono da própria estante (`EstantePage`) clica pra abrir `UpdateProgressModal` (`onSelecionarItem`
 * obrigatório nesse modo); visitante do perfil de terceiro (`ProfilePage`) só pode ver o livro —
 * cada item vira um `Link` pra `/livros/:id`, mesmo destino de `BookSearchResults`.
 * @param {{ itens: object[], onSelecionarItem?: (item: object) => void, readOnly?: boolean }} props
 */
function ShelfGrid({ itens, onSelecionarItem, readOnly = false }) {
  return (
    <ul className={styles.grade}>
      {itens.map((item) => {
        const conteudo = (
          <>
            <BookCoverThumb src={item.livro.capaUrl} title={item.livro.titulo} />
            <span className={styles.titulo}>{item.livro.titulo}</span>
            <span className={styles.autor}>{item.livro.autor}</span>
            {item.status === 'lendo' ? (
              <ReadingProgressBar
                paginaAtual={item.paginaAtual}
                paginaTotal={item.livro.numeroPaginas}
              />
            ) : null}
          </>
        )

        return (
          <li key={item.id}>
            {readOnly ? (
              <Link to={`/livros/${item.livro.id}`} className={styles.item}>
                {conteudo}
              </Link>
            ) : (
              <button type="button" className={styles.item} onClick={() => onSelecionarItem(item)}>
                {conteudo}
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export { ShelfGrid }
