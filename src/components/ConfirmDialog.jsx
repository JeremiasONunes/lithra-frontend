import { Button } from './Button'
import { Modal } from './Modal'
import styles from '../styles/components/ConfirmDialog.module.css'

/**
 * Confirmação de ação destrutiva — compõe `Modal` (Etapa 4). `destructive` estiliza o botão de
 * confirmação com os tokens `--danger`/`--on-danger` por cima do `variant="primary"` — o `Button`
 * da Etapa 4 não tem variante "danger" própria; em vez de alterar retroativamente um componente já
 * aprovado, o override usa o seletor `.acoes .destrutivo` (duas classes, mais específico que
 * `.primary` do `Button`) para não depender da ordem em que o bundler concatena os CSS Modules.
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   onConfirm: () => void,
 *   title: string,
 *   message: string,
 *   confirmLabel?: string,
 *   cancelLabel?: string,
 *   destructive?: boolean,
 * }} props
 */
function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className={styles.corpo}>
        <p className={styles.mensagem}>{message}</p>
        <div className={styles.acoes}>
          <Button variant="ghost" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            className={destructive ? styles.destrutivo : ''}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export { ConfirmDialog }
