import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from './components/Button'
import { Input } from './components/Input'
import { Textarea } from './components/Textarea'
import { Card } from './components/Card'
import { Badge } from './components/Badge'
import { Avatar } from './components/Avatar'
import { Modal } from './components/Modal'
import { ProgressBar } from './components/ProgressBar'
import { Skeleton } from './components/Skeleton'
import styles from './styles/DevTokensPage.module.css'

/**
 * Página temporária de conferência visual dos componentes da Etapa 4 — mesmo tratamento de
 * `/dev/tokens` (Etapa 3): não é produto, é diagnóstico descartável, removido antes da Etapa 22.
 * Reaproveita `DevTokensPage.module.css` (mesmo layout de página de conferência, sem duplicar CSS).
 */
function DevComponentesPage() {
  const [modalAberto, setModalAberto] = useState(false)

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Lythra — Conferência de Componentes (Etapa 4)</h1>
      <p className={styles.subtitle}>
        Página temporária, não faz parte do produto final. Removida antes da Etapa 22.
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Button</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" disabled>
            Desabilitado
          </Button>
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Input</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px' }}>
          <Input id="dev-input" label="Nome" placeholder="Seu nome" />
          <Input
            id="dev-input-error"
            label="E-mail"
            defaultValue="invalido"
            error="E-mail inválido."
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Textarea</h2>
        <div style={{ maxWidth: '320px' }}>
          <Textarea id="dev-textarea" label="Resenha" placeholder="O que você achou deste livro?" />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Card</h2>
        <Card style={{ maxWidth: '320px' }}>Conteúdo dentro de um Card.</Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Badge</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Badge tone="neutral">Neutral</Badge>
          <Badge tone="primary">Primary</Badge>
          <Badge tone="secondary">Secondary</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="danger">Danger</Badge>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Avatar</h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Avatar name="Mariana Silva" size="sm" />
          <Avatar name="Lucas Andrade" size="md" />
          <Avatar name="José Pereira" size="lg" />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Modal</h2>
        <Button variant="secondary" onClick={() => setModalAberto(true)}>
          <Trash2 size={16} aria-hidden="true" />
          Abrir modal de exemplo
        </Button>
        <Modal open={modalAberto} onClose={() => setModalAberto(false)} title="Excluir avaliação?">
          <p>Essa ação não pode ser desfeita.</p>
          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}
          >
            <Button variant="ghost" onClick={() => setModalAberto(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => setModalAberto(false)}>
              Confirmar
            </Button>
          </div>
        </Modal>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>ProgressBar</h2>
        <div style={{ maxWidth: '320px' }}>
          <ProgressBar value={184} max={270} label="Página 184 de 270" />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Skeleton</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '320px' }}>
          <Skeleton height="20px" width="60%" />
          <Skeleton height="14px" />
          <Skeleton height="14px" width="80%" />
          <Skeleton circle width="40px" height="40px" />
        </div>
      </section>
    </main>
  )
}

export default DevComponentesPage
