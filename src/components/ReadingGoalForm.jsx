import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useAtualizarMetaDeLeitura } from '../hooks/useAtualizarMetaDeLeitura'
import { Button } from './Button'
import { Card } from './Card'
import { Input } from './Input'
import styles from '../styles/components/ReadingGoalForm.module.css'

const esquema = z.object({
  metaLivros: z.coerce
    .number({ message: 'Informe uma meta válida.' })
    .int()
    .positive('A meta precisa ser de pelo menos 1 livro.'),
})

/**
 * Define ou atualiza a Meta de Leitura de um ano — um formulário só pros dois casos
 * (`useAtualizarMetaDeLeitura` decide criar/atualizar sozinho a partir de `metaExistente`).
 * `usuarioId`/`ano` não passam por `register()` (não são campos editáveis do formulário, só
 * contexto pra montar o payload).
 * @param {{
 *   usuarioId: string,
 *   ano: number,
 *   metaExistente?: object,
 *   onSalvo: (meta: object) => void,
 * }} props
 */
function ReadingGoalForm({ usuarioId, ano, metaExistente, onSalvo }) {
  const [erroGeral, setErroGeral] = useState(null)
  const { salvar, enviando } = useAtualizarMetaDeLeitura(onSalvo)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(esquema),
    defaultValues: { metaLivros: metaExistente?.metaLivros ?? 12 },
  })

  async function aoSubmeter(dados) {
    setErroGeral(null)
    try {
      await salvar(metaExistente, { usuarioId, ano, metaLivros: dados.metaLivros })
    } catch (erro) {
      setErroGeral(erro.message)
    }
  }

  return (
    <Card className={styles.card}>
      <form onSubmit={handleSubmit(aoSubmeter)} className={styles.formulario} noValidate>
        <Input
          label={`Meta de livros para ${ano}`}
          id="metaLivros"
          type="number"
          min="1"
          error={errors.metaLivros?.message}
          {...register('metaLivros')}
        />
        {erroGeral ? (
          <p role="alert" className={styles.erroGeral}>
            {erroGeral}
          </p>
        ) : null}
        <Button type="submit" variant="primary" disabled={enviando}>
          {enviando ? 'Salvando...' : metaExistente ? 'Atualizar meta' : 'Definir meta'}
        </Button>
      </form>
    </Card>
  )
}

export { ReadingGoalForm }
