import { useState } from 'react'

import { useMesclarLivros } from '../hooks/useMesclarLivros'
import { Button } from './Button'
import { Modal } from './Modal'
import styles from '../styles/components/MergeDuplicatesDialog.module.css'

/**
 * Escolhe qual livro é o duplicado de `livroPrincipal` e mescla os dois (#22 — Gestão de Catálogo).
 * Compõe `Modal` (Etapa 4) na mão, como `ConfirmDialog` (Etapa 6) já faz — aqui precisa de uma
 * lista de seleção no meio, então não reaproveita `ConfirmDialog` (que só tem mensagem + confirmar/
 * cancelar, sem espaço pra escolha).
 *
 * Radio nativo (`<input type="radio">"`), sem componente novo — mesma decisão já tomada pro
 * checkbox de termos (Etapa 9: "single-use case doesn't justify a new abstraction").
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   livroPrincipal: object | null,
 *   livros: object[],
 *   onMesclado: () => void,
 * }} props
 */
function MergeDuplicatesDialog({ open, onClose, livroPrincipal, livros, onMesclado }) {
  const [livroDuplicadoId, setLivroDuplicadoId] = useState('')
  const [erro, setErro] = useState(null)
  const { mesclar, enviando } = useMesclarLivros(() => {
    setLivroDuplicadoId('')
    onMesclado()
    onClose()
  })

  if (!livroPrincipal) return null

  const candidatos = livros.filter((livro) => livro.id !== livroPrincipal.id)

  async function aoConfirmar() {
    setErro(null)
    try {
      await mesclar(livroPrincipal.id, livroDuplicadoId)
    } catch (e) {
      setErro(e.message)
    }
  }

  function aoFechar() {
    setLivroDuplicadoId('')
    setErro(null)
    onClose()
  }

  return (
    <Modal open={open} onClose={aoFechar} title={`Mesclar duplicado de "${livroPrincipal.titulo}"`}>
      <div className={styles.corpo}>
        <p className={styles.aviso}>
          As avaliações e itens de estante do livro duplicado passam a apontar para{' '}
          <strong>{livroPrincipal.titulo}</strong>, e o duplicado é removido do catálogo. Esta ação
          não pode ser desfeita.
        </p>
        {candidatos.length === 0 ? (
          <p className={styles.vazio}>Não há outro livro no catálogo para mesclar.</p>
        ) : (
          <fieldset className={styles.lista}>
            <legend className={styles.legenda}>Qual livro é o duplicado?</legend>
            {candidatos.map((livro) => (
              <label key={livro.id} className={styles.opcao}>
                <input
                  type="radio"
                  name="livroDuplicado"
                  value={livro.id}
                  checked={livroDuplicadoId === livro.id}
                  onChange={() => setLivroDuplicadoId(livro.id)}
                />
                {livro.titulo} <span className={styles.autor}>— {livro.autor}</span>
              </label>
            ))}
          </fieldset>
        )}
        {erro ? (
          <p role="alert" className={styles.erroGeral}>
            {erro}
          </p>
        ) : null}
        <div className={styles.acoes}>
          <Button variant="ghost" onClick={aoFechar}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={aoConfirmar}
            disabled={!livroDuplicadoId || enviando}
          >
            {enviando ? 'Mesclando...' : 'Mesclar'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export { MergeDuplicatesDialog }
