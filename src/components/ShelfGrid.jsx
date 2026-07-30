import { BookCoverThumb } from './BookCoverThumb'
import { ReadingProgressBar } from './ReadingProgressBar'
import styles from '../styles/components/ShelfGrid.module.css'

/**
 * Grade de itens da estante — já filtrados (status/gênero) e cruzados com o livro correspondente
 * (`item.livro`) pela própria `EstantePage`, que já precisa desse cruzamento pra calcular as opções
 * do filtro de gênero (evita fazer o mesmo `find` duas vezes, uma na página e outra aqui). Clique no
 * item abre `UpdateProgressModal`; a barra de progresso só aparece pra itens "lendo" (parada em
 * "quero ler"/"lido" não tem página atual significativa, ver `itemDaEstanteService`).
 * @param {{ itens: object[], onSelecionarItem: (item: object) => void }} props
 */
function ShelfGrid({ itens, onSelecionarItem }) {
  return (
    <ul className={styles.grade}>
      {itens.map((item) => (
        <li key={item.id}>
          <button type="button" className={styles.item} onClick={() => onSelecionarItem(item)}>
            <BookCoverThumb src={item.livro.capaUrl} title={item.livro.titulo} />
            <span className={styles.titulo}>{item.livro.titulo}</span>
            <span className={styles.autor}>{item.livro.autor}</span>
            {item.status === 'lendo' ? (
              <ReadingProgressBar
                paginaAtual={item.paginaAtual}
                paginaTotal={item.livro.numeroPaginas}
              />
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  )
}

export { ShelfGrid }
