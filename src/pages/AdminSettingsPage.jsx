import { PageHeader } from '../components/PageHeader'
import { SystemSettingsForm } from '../components/SystemSettingsForm'
import styles from '../styles/pages/AdminSettingsPage.module.css'

/**
 * Configurações do Sistema (#24) — `SystemSettingsForm` já é autossuficiente (lê e salva sozinho
 * via `useConfiguracoesDoSistema`), a página só compõe o cabeçalho.
 */
function AdminSettingsPage() {
  return (
    <div className={styles.wrapper}>
      <PageHeader title="Configurações do sistema" />
      <SystemSettingsForm />
    </div>
  )
}

export { AdminSettingsPage }
