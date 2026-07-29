import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { z } from 'zod'

import { Button } from './Button'
import { Card } from './Card'
import { Input } from './Input'
import styles from '../styles/components/RecuperarSenhaForm.module.css'

const esquema = z.object({
  email: z.string().min(1, 'Informe seu e-mail.').email('E-mail inválido.'),
})

/** Fluxo simulado — `usuarioService` (Etapa 7) não tem um método de redefinição de senha, e o
 * roadmap desta etapa não pede um novo. Só valida o e-mail e mostra a confirmação, mesmo
 * comportamento da tela de referência do Design System (sem chamada a service nenhum). */
function RecuperarSenhaForm() {
  const [enviado, setEnviado] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(esquema) })

  function aoSubmeter() {
    setEnviado(true)
  }

  return (
    <Card className={styles.card}>
      <h1 className={styles.titulo}>Recuperar senha</h1>
      {enviado ? (
        <p className={styles.confirmacao} role="status">
          <CheckCircle2 aria-hidden="true" size={20} />
          Enviamos um link de redefinição para o e-mail informado.
        </p>
      ) : (
        <form onSubmit={handleSubmit(aoSubmeter)} className={styles.formulario} noValidate>
          <Input
            label="E-mail"
            id="email"
            type="email"
            placeholder="voce@exemplo.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar link'}
          </Button>
        </form>
      )}
      <p className={styles.rodape}>
        <Link to="/login">Voltar ao login</Link>
      </p>
    </Card>
  )
}

export { RecuperarSenhaForm }
