import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useAuth } from '../context/AuthContext'
import { useAtualizarAvaliacao } from '../hooks/useAtualizarAvaliacao'
import { useCriarAvaliacao } from '../hooks/useCriarAvaliacao'
import { Button } from './Button'
import { Modal } from './Modal'
import { RatingStars } from './RatingStars'
import { Textarea } from './Textarea'
import styles from '../styles/components/ReviewForm.module.css'

const esquema = z.object({
  nota: z.number().min(1, 'Dê uma nota de 1 a 5 estrelas.').max(5),
  resenha: z.string().min(1, 'Escreva sua resenha.'),
})

/**
 * Modal de criar/editar avaliação (#15) — mesmo componente pros dois casos, `avaliacaoExistente`
 * decide o modo. `nota` usa `watch`/`setValue` do RHF em vez de `register()`: `RatingStars` não é
 * um `<input>` nativo (é uma linha de botões), então não tem como `register()` ler o valor sozinho
 * — é o mesmo motivo de `Controller` existir no RHF, mas pra um único campo, `watch`/`setValue` é
 * mais simples de ler do que introduzir a API de `Controller` só pra isso.
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   livroId: string,
 *   avaliacaoExistente?: object,
 *   onSalvo: () => void,
 * }} props
 */
function ReviewForm({ open, onClose, livroId, avaliacaoExistente, onSalvo }) {
  const { usuario } = useAuth()
  const [erroGeral, setErroGeral] = useState(null)

  const { criar, enviando: criando } = useCriarAvaliacao(() => {
    onSalvo()
    onClose()
  })
  const { atualizar, enviando: atualizando } = useAtualizarAvaliacao(() => {
    onSalvo()
    onClose()
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(esquema),
    defaultValues: { nota: 0, resenha: '' },
  })

  useEffect(() => {
    if (!open) return
    reset({
      nota: avaliacaoExistente?.nota ?? 0,
      resenha: avaliacaoExistente?.resenha ?? '',
    })
    setErroGeral(null)
  }, [open, avaliacaoExistente, reset])

  async function aoSubmeter(dados) {
    setErroGeral(null)
    try {
      if (avaliacaoExistente) {
        await atualizar(avaliacaoExistente.id, dados)
      } else {
        await criar({ usuarioId: usuario.id, livroId, ...dados })
      }
    } catch (erro) {
      setErroGeral(erro.message)
    }
  }

  const enviando = criando || atualizando

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={avaliacaoExistente ? 'Editar avaliação' : 'Avaliar livro'}
    >
      <form onSubmit={handleSubmit(aoSubmeter)} className={styles.formulario} noValidate>
        <div className={styles.campoNota}>
          <RatingStars
            value={watch('nota')}
            readOnly={false}
            size={28}
            onChange={(valor) => setValue('nota', valor, { shouldValidate: true })}
          />
          {errors.nota ? (
            <span role="alert" className={styles.erroNota}>
              {errors.nota.message}
            </span>
          ) : null}
        </div>
        <Textarea
          label="Sua resenha"
          id="resenha"
          placeholder="O que você achou deste livro?"
          error={errors.resenha?.message}
          {...register('resenha')}
        />
        {erroGeral ? (
          <p role="alert" className={styles.erroGeral}>
            {erroGeral}
          </p>
        ) : null}
        <Button type="submit" variant="primary" disabled={enviando}>
          {enviando ? 'Publicando...' : 'Publicar avaliação'}
        </Button>
      </form>
    </Modal>
  )
}

export { ReviewForm }
