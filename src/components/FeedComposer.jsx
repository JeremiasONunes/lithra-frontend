import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { z } from 'zod'

import { useAuth } from '../context/AuthContext'
import { useCriarPost } from '../hooks/useCriarPost'
import { Button } from './Button'
import { Card } from './Card'
import { Textarea } from './Textarea'
import styles from '../styles/components/FeedComposer.module.css'

const esquema = z.object({
  texto: z.string().min(1, 'Escreva algo pra compartilhar.'),
})

/**
 * Topo do Feed — dois pontos de entrada visualmente distintos (Critério de Aceite da Etapa 14):
 * publicar uma atualização de texto livre (formulário RHF+Zod, mesmo padrão de `ReviewForm`/
 * `ManualBookForm`) e buscar um livro (link direto pra `/buscar-livro`, fluxo já pronto da Etapa 12
 * — não duplicado aqui). Dono da própria mutation (`useCriarPost`), mesmo padrão de `ManualBookForm`
 * possuindo `useCadastrarLivro`.
 * @param {{ onPublicado: () => void }} props
 */
function FeedComposer({ onPublicado }) {
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

  const { publicar, enviando } = useCriarPost(() => {
    reset({ texto: '' })
    onPublicado()
  })

  async function aoSubmeter(dados) {
    setErroGeral(null)
    try {
      await publicar({ tipo: 'post-livre', usuarioId: usuario.id, texto: dados.texto })
    } catch (erro) {
      setErroGeral(erro.message)
    }
  }

  return (
    <Card className={styles.card}>
      <form onSubmit={handleSubmit(aoSubmeter)} className={styles.formulario} noValidate>
        <Textarea
          id="composer-texto"
          aria-label="Compartilhar uma atualização"
          placeholder="Compartilhar uma atualização..."
          error={errors.texto?.message}
          {...register('texto')}
        />
        {erroGeral ? (
          <p role="alert" className={styles.erroGeral}>
            {erroGeral}
          </p>
        ) : null}
        <Button type="submit" variant="primary" disabled={enviando}>
          {enviando ? 'Publicando...' : 'Publicar'}
        </Button>
      </form>
      <Link to="/buscar-livro" className={styles.buscarLivro}>
        <Search size={18} aria-hidden="true" />
        Buscar livro
      </Link>
    </Card>
  )
}

export { FeedComposer }
