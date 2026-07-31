import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useAuth } from '../context/AuthContext'
import { useCriarComentario } from '../hooks/useCriarComentario'
import { Button } from './Button'
import { LoadingList } from './LoadingList'
import { Textarea } from './Textarea'
import { UserAvatar } from './UserAvatar'
import styles from '../styles/components/ActivityComments.module.css'

const esquema = z.object({
  texto: z.string().min(1, 'Escreva um comentário.'),
})

/**
 * Painel de comentários de uma atividade do feed — lista os já existentes (recebidos prontos de
 * `ActivityCard`, que já os buscou via `useComentariosDaAtividade`) + formulário inline pra
 * adicionar um novo, com Enviar/Cancelar. Dono da própria mutation (`useCriarComentario`), mesmo
 * padrão de `ManualBookForm`/`FeedComposer` possuindo sua própria mutation de criação — só a
 * leitura fica em `ActivityCard` (o botão de curtir/comentar também precisa saber a contagem, sem
 * duplicar a busca).
 * @param {{
 *   atividadeId: string,
 *   comentarios: object[],
 *   carregando: boolean,
 *   usuarios?: object[],
 *   onComentarioEnviado: () => void,
 *   onCancelar: () => void,
 * }} props
 */
function ActivityComments({
  atividadeId,
  comentarios,
  carregando,
  usuarios,
  onComentarioEnviado,
  onCancelar,
}) {
  const { usuario } = useAuth()
  const [erroGeral, setErroGeral] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(esquema),
    defaultValues: { texto: '' },
  })

  const { criar, enviando } = useCriarComentario(() => {
    reset({ texto: '' })
    onComentarioEnviado()
  })

  async function aoSubmeter(dados) {
    setErroGeral(null)
    try {
      await criar({ atividadeId, usuarioId: usuario.id, texto: dados.texto })
    } catch (erro) {
      setErroGeral(erro.message)
    }
  }

  return (
    <div className={styles.wrapper}>
      {carregando ? (
        <LoadingList count={2} height="48px" />
      ) : (
        <ul className={styles.lista}>
          {comentarios.map((comentario) => {
            const autor = usuarios?.find((item) => item.id === comentario.usuarioId)
            return (
              <li key={comentario.id} className={styles.item}>
                <UserAvatar name={autor?.nome ?? 'Usuário'} src={autor?.fotoUrl} size="sm" />
                <div className={styles.corpo}>
                  <span className={styles.nome}>{autor?.nome ?? 'Usuário'}</span>
                  <p className={styles.texto}>{comentario.texto}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
      <form onSubmit={handleSubmit(aoSubmeter)} className={styles.formulario} noValidate>
        <Textarea
          id={`comentario-${atividadeId}`}
          aria-label="Escrever um comentário"
          placeholder="Escreva um comentário..."
          error={errors.texto?.message}
          {...register('texto')}
        />
        {erroGeral ? (
          <p role="alert" className={styles.erroGeral}>
            {erroGeral}
          </p>
        ) : null}
        <div className={styles.acoesFormulario}>
          <Button type="button" variant="ghost" onClick={onCancelar}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export { ActivityComments }
