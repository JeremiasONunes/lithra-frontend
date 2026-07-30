import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useAtualizarItemDaEstante } from '../hooks/useAtualizarItemDaEstante'
import { useRemoverDaEstante } from '../hooks/useRemoverDaEstante'
import { Button } from './Button'
import { ConfirmDialog } from './ConfirmDialog'
import { Input } from './Input'
import { Modal } from './Modal'
import { ReadingProgressBar } from './ReadingProgressBar'
import styles from '../styles/components/UpdateProgressModal.module.css'

const STATUS_OPCOES = [
  { valor: 'quero-ler', rotulo: 'Quero Ler' },
  { valor: 'lendo', rotulo: 'Lendo' },
  { valor: 'lido', rotulo: 'Lido' },
]

function criarEsquema(paginaTotal) {
  return z.object({
    status: z.enum(['quero-ler', 'lendo', 'lido']),
    paginaAtual: z.coerce
      .number({ message: 'Informe a página atual.' })
      .int()
      .min(0, 'A página não pode ser negativa.')
      .max(paginaTotal, `O livro tem só ${paginaTotal} páginas.`),
  })
}

/**
 * Atualizar Progresso (#14) — modal que edita status/página de um `ItemDaEstante`, mais a ação de
 * remover da estante (via `ConfirmDialog`, mesmo padrão de exclusão de avaliação da Etapa 12).
 *
 * `paginaAtual` só é significativa quando `status === 'lendo'` (comentário já documentado em
 * `itemDaEstanteService.js`) — em vez de esconder/desabilitar o campo com efeitos, o valor
 * submetido é corrigido na hora de enviar (0 pra "quero ler", total de páginas pra "lido"), mais
 * simples do que sincronizar o campo via `useEffect` a cada troca de status.
 *
 * A transição "Lendo → Lido" aciona `onConcluidoLeitura` (atalho pra abrir o `ReviewForm` já
 * existente, Etapa 12) — comparação entre o status anterior (`item`, capturado no fechamento) e o
 * novo (resultado da mutation), só dispara nessa transição específica, não em qualquer mudança pra
 * "lido".
 * @param {{
 *   item?: object,
 *   open: boolean,
 *   onClose: () => void,
 *   onAtualizado: () => void,
 *   onConcluidoLeitura?: (item: object) => void,
 * }} props
 */
function UpdateProgressModal({ item, open, onClose, onAtualizado, onConcluidoLeitura }) {
  const [confirmandoRemocao, setConfirmandoRemocao] = useState(false)
  const [erroGeral, setErroGeral] = useState(null)

  const { atualizar, enviando: atualizando } = useAtualizarItemDaEstante((atualizado) => {
    onAtualizado()
    onClose()
    if (item?.status === 'lendo' && atualizado.status === 'lido') {
      onConcluidoLeitura?.(atualizado)
    }
  })
  const { remover, enviando: removendo } = useRemoverDaEstante(() => {
    onAtualizado()
    onClose()
  })

  const paginaTotal = item?.livro?.numeroPaginas ?? 0

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(criarEsquema(paginaTotal || 1)),
    defaultValues: { status: 'quero-ler', paginaAtual: 0 },
  })

  useEffect(() => {
    if (!open || !item) return
    reset({ status: item.status, paginaAtual: item.paginaAtual })
    setErroGeral(null)
  }, [open, item, reset])

  if (!item) return null

  async function aoSubmeter(dados) {
    setErroGeral(null)
    const paginaAtual =
      dados.status === 'lido' ? paginaTotal : dados.status === 'quero-ler' ? 0 : dados.paginaAtual
    try {
      await atualizar(item.id, { status: dados.status, paginaAtual })
    } catch (erro) {
      setErroGeral(erro.message)
    }
  }

  async function aoConfirmarRemocao() {
    setConfirmandoRemocao(false)
    try {
      await remover(item.id)
    } catch {
      // erro já fica em `erro` do hook; mesmo padrão do resto do projeto (sem tratamento extra)
    }
  }

  return (
    <>
      <Modal open={open} onClose={onClose} title="Atualizar Progresso">
        <div className={styles.corpo}>
          <p className={styles.titulo}>{item.livro?.titulo}</p>
          <ReadingProgressBar paginaAtual={watch('paginaAtual')} paginaTotal={paginaTotal} />
          <form onSubmit={handleSubmit(aoSubmeter)} className={styles.formulario} noValidate>
            <div className={styles.campo}>
              <label htmlFor="status" className={styles.label}>
                Status
              </label>
              <select id="status" className={styles.select} {...register('status')}>
                {STATUS_OPCOES.map((opcao) => (
                  <option key={opcao.valor} value={opcao.valor}>
                    {opcao.rotulo}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Página atual"
              id="paginaAtual"
              type="number"
              min="0"
              max={paginaTotal}
              error={errors.paginaAtual?.message}
              {...register('paginaAtual')}
            />
            {erroGeral ? (
              <p role="alert" className={styles.erroGeral}>
                {erroGeral}
              </p>
            ) : null}
            <div className={styles.acoes}>
              <Button type="button" variant="ghost" onClick={() => setConfirmandoRemocao(true)}>
                Remover da estante
              </Button>
              <Button type="submit" variant="primary" disabled={atualizando || removendo}>
                {atualizando ? 'Salvando...' : 'Salvar progresso'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      <ConfirmDialog
        open={confirmandoRemocao}
        onClose={() => setConfirmandoRemocao(false)}
        onConfirm={aoConfirmarRemocao}
        title="Remover da estante"
        message={`Tem certeza que quer remover "${item.livro?.titulo}" da sua estante?`}
        confirmLabel="Remover"
        destructive
      />
    </>
  )
}

export { UpdateProgressModal }
