import { Modal } from './Modal'
import { BookCoverThumb } from './BookCoverThumb'
import { useAuth } from '../context/AuthContext'
import { useEstante } from '../hooks/useEstante'
import { useLivros } from '../hooks/useLivros'
import styles from '../styles/components/EscolherLivroModal.module.css'

/**
 * Escolher um livro da própria estante pra anexar a uma publicação do feed (`FeedComposer`).
 * Reaproveita `useEstante`/`useLivros` (Etapa 13) — nenhum hook novo, já existiam pra outro fim
 * (grade da Estante); sem filtro de status/gênero aqui, mostra a estante inteira.
 * @param {{ open: boolean, onClose: () => void, onSelecionar: (livro: object) => void }} props
 */
function EscolherLivroModal({ open, onClose, onSelecionar }) {
  const { usuario } = useAuth()
  const { dado: itens } = useEstante(usuario.id, {})
  const { dado: livros } = useLivros()

  const itensComLivro = (itens ?? []).map((item) => ({
    ...item,
    livro: livros?.find((livro) => livro.id === item.livroId),
  }))

  return (
    <Modal open={open} onClose={onClose} title="Escolher livro da estante">
      {itensComLivro.length === 0 ? (
        <p className={styles.vazio}>Sua estante ainda não tem nenhum livro.</p>
      ) : (
        <ul className={styles.grade}>
          {itensComLivro.map(
            (item) =>
              item.livro && (
                <li key={item.id}>
                  <button
                    type="button"
                    className={styles.item}
                    onClick={() => {
                      onSelecionar(item.livro)
                      onClose()
                    }}
                  >
                    <BookCoverThumb src={item.livro.capaUrl} title={item.livro.titulo} size="sm" />
                    <span className={styles.titulo}>{item.livro.titulo}</span>
                  </button>
                </li>
              ),
          )}
        </ul>
      )}
    </Modal>
  )
}

export { EscolherLivroModal }
