import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { useAuth } from '../context/AuthContext'
import { Button } from './Button'
import { Card } from './Card'
import { Input } from './Input'
import { TermosDeUsoModal } from './TermosDeUsoModal'
import styles from '../styles/components/CadastroForm.module.css'

const esquema = z
  .object({
    nome: z.string().min(1, 'Informe seu nome.'),
    email: z.string().min(1, 'Informe seu e-mail.').email('E-mail inválido.'),
    senha: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres.'),
    confirmarSenha: z.string().min(1, 'Confirme sua senha.'),
    aceiteTermos: z
      .boolean()
      .refine((valor) => valor === true, { message: 'É preciso aceitar os termos de uso.' }),
  })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    message: 'As senhas não conferem.',
    path: ['confirmarSenha'],
  })

/** Toda conta criada por aqui nasce papel `leitor` (`usuarioService.criar`, Etapa 7 — conta de
 * administrador não é autoatendimento). Erro de e-mail já cadastrado vem de `useAuth().cadastrar`
 * propagando a exceção de `usuarioService.criar`, diferente de `LoginForm`: aqui é uma falha real,
 * não um fluxo esperado. */
function CadastroForm() {
  const { cadastrar } = useAuth()
  const navigate = useNavigate()
  const [erroCadastro, setErroCadastro] = useState(null)
  const [termosAbertos, setTermosAbertos] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(esquema), defaultValues: { aceiteTermos: false } })

  async function aoSubmeter(dados) {
    setErroCadastro(null)
    try {
      await cadastrar({ nome: dados.nome, email: dados.email, senha: dados.senha })
      navigate('/feed')
    } catch (erro) {
      setErroCadastro(erro.message)
    }
  }

  return (
    <Card className={styles.card}>
      <h1 className={styles.titulo}>Criar conta</h1>
      <form onSubmit={handleSubmit(aoSubmeter)} className={styles.formulario} noValidate>
        <Input
          label="Nome"
          id="nome"
          placeholder="Seu nome"
          autoComplete="name"
          error={errors.nome?.message}
          {...register('nome')}
        />
        <Input
          label="E-mail"
          id="email"
          type="email"
          placeholder="voce@exemplo.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Senha"
          id="senha"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.senha?.message}
          {...register('senha')}
        />
        <Input
          label="Confirmar senha"
          id="confirmarSenha"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.confirmarSenha?.message}
          {...register('confirmarSenha')}
        />
        <div className={styles.termosCampo}>
          <label className={styles.termos}>
            <input type="checkbox" className={styles.checkbox} {...register('aceiteTermos')} />
            <span>
              Ao continuar, você aceita os{' '}
              <button
                type="button"
                className={styles.linkTermos}
                onClick={() => setTermosAbertos(true)}
              >
                termos de uso
              </button>{' '}
              do Lythra.
            </span>
          </label>
          {errors.aceiteTermos ? (
            <span role="alert" className={styles.erroTermos}>
              {errors.aceiteTermos.message}
            </span>
          ) : null}
        </div>
        {erroCadastro ? (
          <p role="alert" className={styles.erroGeral}>
            {erroCadastro}
          </p>
        ) : null}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>
      <p className={styles.rodape}>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
      <TermosDeUsoModal open={termosAbertos} onClose={() => setTermosAbertos(false)} />
    </Card>
  )
}

export { CadastroForm }
