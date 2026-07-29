import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { useAuth } from '../context/AuthContext'
import { Button } from './Button'
import { Card } from './Card'
import { Input } from './Input'
import styles from '../styles/components/LoginForm.module.css'

const esquema = z.object({
  email: z.string().min(1, 'Informe seu e-mail.').email('E-mail inválido.'),
  senha: z.string().min(1, 'Informe sua senha.'),
})

/** `useAuth().login` nunca lança erro pra credencial inválida (mesmo contrato de
 * `usuarioService.verificarCredenciais`, Etapa 7/8) — retorna `null`, tratado aqui como erro geral
 * do formulário, não de um campo específico. */
function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [erroCredenciais, setErroCredenciais] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(esquema) })

  async function aoSubmeter(dados) {
    setErroCredenciais(null)
    const usuario = await login(dados.email, dados.senha)

    if (!usuario) {
      setErroCredenciais('E-mail ou senha incorretos.')
      return
    }

    navigate(usuario.papel === 'administrador' ? '/admin' : '/feed')
  }

  return (
    <Card className={styles.card}>
      <h1 className={styles.titulo}>Entrar</h1>
      <form onSubmit={handleSubmit(aoSubmeter)} className={styles.formulario} noValidate>
        <Input
          label="E-mail"
          id="email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Senha"
          id="senha"
          type="password"
          autoComplete="current-password"
          error={errors.senha?.message}
          {...register('senha')}
        />
        {erroCredenciais ? (
          <p role="alert" className={styles.erroGeral}>
            {erroCredenciais}
          </p>
        ) : null}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
      <p className={styles.rodape}>
        Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
      <p className={styles.rodape}>
        <Link to="/recuperar-senha">Esqueci minha senha</Link>
      </p>
    </Card>
  )
}

export { LoginForm }
