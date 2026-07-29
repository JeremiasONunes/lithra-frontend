import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'
import styles from './Modal.module.css'

/**
 * Modal acessível implementado na mão (sem Radix — ver `01-arquitetura-frontend.md`): fecha com
 * `Esc`, foco entra no diálogo ao abrir e volta pro elemento que abriu ao fechar, `role="dialog"` +
 * `aria-modal` + `aria-labelledby` apontando pro título. Não implementa ciclo de `Tab` preso dentro
 * do modal (focus trap completo) — deliberadamente, para manter o componente simples; o essencial de
 * acessibilidade (fechar, foco não se perder) já está coberto.
 */
function Modal({ open, onClose, title, children }) {
  const titleId = useId()
  const dialogRef = useRef(null)
  const previouslyFocusedRef = useRef(null)

  useEffect(() => {
    if (!open) return

    previouslyFocusedRef.current = document.activeElement
    dialogRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocusedRef.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={styles.dialog}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <h3 id={titleId} className={styles.title}>
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className={styles.closeButton}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export { Modal }
