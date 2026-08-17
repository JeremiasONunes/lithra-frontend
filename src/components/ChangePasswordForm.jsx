import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useAlterarSenha } from '../hooks/useAlterarSenha'
import { Button } from './Button'
import { Card } from './Card'
import { Input } from './Input'
import styles from '../styles/components/ChangePasswordForm.module.css'

const esquema = z
  .object({
    senhaAtual: z.string().min(1, 'Informe sua senha atual.'),
    novaSenha: z.string().min(6, 'A nova senha precisa ter pelo menos 6 caracteres.'),
    confirmarNovaSenha: z.string().min(1, 'Confirme a nova senha.'),
  })
  .refine((dados) => dados.novaSenha === dados.confirmarNovaSenha, {
    message: 'As senhas não conferem.',
    path: ['confirmarNovaSenha'],
  })

/**
 * Alterar senha (#20) — "validando senha atual mockada" (Descrição da Etapa 18):
 * `useAlterarSenha` confere `senhaAtual` via `usuarioService.verificarCredenciais` antes de trocar;
 * erro de senha atual incorreta vira `erroGeral`, mesmo padrão de `LoginForm` (Etapa 9). `reset()`
 * limpa os 3 campos ao concluir com sucesso — não faz sentido deixar a senha (nem a nova, nem a
 * atual) visível no formulário depois de trocada.
 * @param {{ usuario: object, onAlterada?: (usuario: object) => void }} props
 */
function ChangePasswordForm({ usuario, onAlterada }) {
  const [erroGeral, setErroGeral] = useState(null)
  const [sucesso, setSucesso] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(esquema) })

  const { alterar, enviando } = useAlterarSenha((atualizado) => {
    setSucesso(true)
    reset()
    onAlterada?.(atualizado)
  })

  async function aoSubmeter(dados) {
    setErroGeral(null)
    setSucesso(false)
    try {
      await alterar(usuario, dados.senhaAtual, dados.novaSenha)
    } catch (erro) {
      setErroGeral(erro.message)
    }
  }

  return (
    <Card className={styles.card}>
      <h2 className={styles.titulo}>Alterar senha</h2>
      <form onSubmit={handleSubmit(aoSubmeter)} className={styles.formulario} noValidate>
        <Input
          label="Senha atual"
          id="senhaAtual"
          type="password"
          autoComplete="current-password"
          error={errors.senhaAtual?.message}
          {...register('senhaAtual')}
        />
        <Input
          label="Nova senha"
          id="novaSenha"
          type="password"
          autoComplete="new-password"
          error={errors.novaSenha?.message}
          {...register('novaSenha')}
        />
        <Input
          label="Confirmar nova senha"
          id="confirmarNovaSenha"
          type="password"
          autoComplete="new-password"
          error={errors.confirmarNovaSenha?.message}
          {...register('confirmarNovaSenha')}
        />
        {erroGeral ? (
          <p role="alert" className={styles.erroGeral}>
            {erroGeral}
          </p>
        ) : null}
        {sucesso ? (
          <p role="status" className={styles.sucesso}>
            Senha alterada com sucesso.
          </p>
        ) : null}
        <Button type="submit" variant="primary" disabled={enviando}>
          {enviando ? 'Alterando...' : 'Alterar senha'}
        </Button>
      </form>
    </Card>
  )
}

export { ChangePasswordForm }
