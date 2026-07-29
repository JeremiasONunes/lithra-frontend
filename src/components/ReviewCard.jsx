import { useState } from 'react'
import { Edit3, Trash2 } from 'lucide-react'

import { Card } from './Card'
import { ConfirmDialog } from './ConfirmDialog'
import { RatingStars } from './RatingStars'
import { UserAvatar } from './UserAvatar'
import styles from '../styles/components/ReviewCard.module.css'

/**
 * Uma avaliação na lista da Página do Livro. Editar/excluir só aparecem quando `podeEditar` (o
 * chamador já decidiu isso comparando `avaliacao.usuarioId` com o usuário logado — Critério de
 * Aceite desta etapa).
 * @param {{
 *   avaliacao: object,
 *   autor?: { nome: string, fotoUrl?: string },
 *   podeEditar: boolean,
 *   onEditar: () => void,
 *   onExcluir: () => void,
 * }} props
 */
function ReviewCard({ avaliacao, autor, podeEditar, onEditar, onExcluir }) {
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)

  return (
    <Card className={styles.card}>
      <div className={styles.cabecalho}>
        <UserAvatar name={autor?.nome ?? 'Usuário'} src={autor?.fotoUrl} size="sm" />
        <div className={styles.autorInfo}>
          <span className={styles.nome}>{autor?.nome ?? 'Usuário'}</span>
          <RatingStars value={avaliacao.nota} size={14} />
        </div>
        {podeEditar ? (
          <div className={styles.acoes}>
            <button
              type="button"
              className={styles.acao}
              onClick={onEditar}
              aria-label="Editar avaliação"
            >
              <Edit3 size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.acao}
              onClick={() => setConfirmandoExclusao(true)}
              aria-label="Excluir avaliação"
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
      <p className={styles.resenha}>{avaliacao.resenha}</p>
      <ConfirmDialog
        open={confirmandoExclusao}
        onClose={() => setConfirmandoExclusao(false)}
        onConfirm={() => {
          setConfirmandoExclusao(false)
          onExcluir()
        }}
        title="Excluir avaliação"
        message="Tem certeza que quer excluir sua avaliação? Essa ação não pode ser desfeita."
        confirmLabel="Excluir"
        destructive
      />
    </Card>
  )
}

export { ReviewCard }
