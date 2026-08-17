import { forwardRef } from 'react'

import styles from '../styles/components/PrivacyToggle.module.css'

/**
 * Toggle de privacidade da Estante — "Estante pública" marcada/desmarcada, mapeado pra
 * `Usuario.privacidadeEstante` (`'publica' | 'privada'`) por quem usa, não aqui (o componente só
 * cuida do booleano visual). Única implementação da UI desse controle no projeto — reaproveitado por
 * `EditProfileForm` (Etapa 16, dentro do formulário RHF, via `register()`) e `ConfiguracoesPage`
 * (Etapa 18, controlado manualmente, salva na hora) — "mesma fonte de estado, não duas" (Checklist
 * Técnico da Etapa 18).
 *
 * `forwardRef`, mesmo padrão de `Input`/`Textarea` (Etapas 9/12): o `ref` que `register()` devolve
 * precisa chegar no `<input>` real do DOM, senão o RHF nunca lê o valor do campo.
 * @param {{ id?: string }} props
 */
const PrivacyToggle = forwardRef(function PrivacyToggle({ id = 'estante-publica', ...props }, ref) {
  return (
    <label htmlFor={id} className={styles.campo}>
      <input ref={ref} type="checkbox" id={id} className={styles.checkbox} {...props} />
      Estante pública
    </label>
  )
})

export { PrivacyToggle }
