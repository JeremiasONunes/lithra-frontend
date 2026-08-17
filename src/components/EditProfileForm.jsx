import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { useAtualizarPerfil } from '../hooks/useAtualizarPerfil'
import { Button } from './Button'
import { Card } from './Card'
import { Input } from './Input'
import { PrivacyToggle } from './PrivacyToggle'
import { Textarea } from './Textarea'
import { UserAvatar } from './UserAvatar'
import buttonStyles from '../styles/components/Button.module.css'
import styles from '../styles/components/EditProfileForm.module.css'

const esquema = z.object({
  nome: z.string().min(1, 'Informe seu nome.'),
  bio: z.string().optional(),
  fotoUrl: z.string().optional(),
  estantePublica: z.boolean(),
})

/**
 * Editar Perfil (#9) — sempre edita o próprio usuário logado (rota `/perfil/editar` não recebe
 * `:username`, diferente de `/perfil/:username`). Foto é upload de arquivo, mesmo padrão de
 * `FeedComposer`/`ManualBookForm` (Etapa 12/14): `FileReader` converte pra data URL, que vira o
 * próprio `fotoUrl` salvo — sem backend real pra hospedar imagem. "Estante pública" é checkbox
 * (não `<select>`), refletindo a referência visual do Design System (`EditProfile.jsx`) — mapeia
 * pra `privacidadeEstante: 'publica' | 'privada'` só na hora de montar o payload.
 *
 * Ao salvar, sincroniza `AuthContext` via `onSalvo` (quem chama, `EditarPerfilPage`, decide o que
 * fazer com o usuário atualizado) — sem isso, `UserMenu`/qualquer outro lugar que lê
 * `useAuth().usuario` ficaria com nome/foto desatualizados até um novo login.
 * "Estante pública" reaproveita `PrivacyToggle` (Etapa 18) — mesmo controle usado em
 * `ConfiguracoesPage`, única implementação da UI de privacidade no projeto ("mesma fonte de estado,
 * não duas", Checklist Técnico da Etapa 18).
 * @param {{ usuario: object, onSalvo: (usuario: object) => void }} props
 */
function EditProfileForm({ usuario, onSalvo }) {
  const navigate = useNavigate()
  const [erroGeral, setErroGeral] = useState(null)
  const { atualizar, enviando } = useAtualizarPerfil(onSalvo)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(esquema),
    defaultValues: {
      nome: usuario.nome,
      bio: usuario.bio ?? '',
      fotoUrl: usuario.fotoUrl ?? '',
      estantePublica: usuario.privacidadeEstante === 'publica',
    },
  })

  const fotoAtual = watch('fotoUrl')
  const nomeAtual = watch('nome')

  function aoSelecionarFoto(evento) {
    const arquivo = evento.target.files?.[0]
    if (!arquivo || !arquivo.type.startsWith('image/')) return

    const leitor = new FileReader()
    leitor.onload = () => setValue('fotoUrl', leitor.result, { shouldValidate: true })
    leitor.readAsDataURL(arquivo)
  }

  async function aoSubmeter(dados) {
    setErroGeral(null)
    try {
      await atualizar(usuario.id, {
        nome: dados.nome,
        bio: dados.bio,
        fotoUrl: dados.fotoUrl,
        privacidadeEstante: dados.estantePublica ? 'publica' : 'privada',
      })
      navigate(`/perfil/${usuario.id}`)
    } catch (erro) {
      setErroGeral(erro.message)
    }
  }

  return (
    <Card className={styles.card}>
      <form onSubmit={handleSubmit(aoSubmeter)} className={styles.formulario} noValidate>
        <div className={styles.linhaFoto}>
          <UserAvatar name={nomeAtual?.trim() || usuario.nome} src={fotoAtual} size="lg" />
          <label className={`${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.sm}`}>
            Trocar foto
            <input
              type="file"
              accept="image/*"
              className={styles.inputEscondido}
              onChange={aoSelecionarFoto}
            />
          </label>
        </div>
        <Input
          label="Nome de exibição"
          id="nome"
          error={errors.nome?.message}
          {...register('nome')}
        />
        <Textarea label="Bio" id="bio" error={errors.bio?.message} {...register('bio')} />
        <PrivacyToggle {...register('estantePublica')} />
        {erroGeral ? (
          <p role="alert" className={styles.erroGeral}>
            {erroGeral}
          </p>
        ) : null}
        <Button type="submit" variant="primary" disabled={enviando}>
          {enviando ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </form>
    </Card>
  )
}

export { EditProfileForm }
