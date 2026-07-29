import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useCadastrarLivro } from '../hooks/useCadastrarLivro'
import { Button } from './Button'
import { Card } from './Card'
import { Input } from './Input'
import { Textarea } from './Textarea'
import styles from '../styles/components/ManualBookForm.module.css'

const esquema = z.object({
  titulo: z.string().min(1, 'Informe o título.'),
  autor: z.string().min(1, 'Informe o autor.'),
  genero: z.string().min(1, 'Informe o gênero.'),
  sinopse: z.string().min(1, 'Informe uma sinopse.'),
  numeroPaginas: z.coerce
    .number({ message: 'Informe o número de páginas.' })
    .int()
    .positive('Informe um número de páginas válido.'),
  ano: z.coerce.number({ message: 'Informe o ano.' }).int().positive('Informe um ano válido.'),
})

/**
 * Cadastro manual de livro — fallback quando a busca não encontra nada (`BuscarLivroPage`). O kit
 * de referência só pede título/autor/gênero; `sinopse`/`numeroPaginas`/`ano` são obrigatórios no
 * formato de `Livro` (Etapa 7), sem eles o livro apareceria quebrado na própria Página do Livro
 * depois — por isso o formulário pede mais campos do que a tela de referência mostra.
 * @param {{ tituloInicial?: string, onCadastrado: (livro: object) => void }} props
 */
function ManualBookForm({ tituloInicial = '', onCadastrado }) {
  const [erroGeral, setErroGeral] = useState(null)
  const { cadastrar, enviando } = useCadastrarLivro(onCadastrado)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(esquema), defaultValues: { titulo: tituloInicial } })

  async function aoSubmeter(dados) {
    setErroGeral(null)
    try {
      await cadastrar(dados)
    } catch (erro) {
      setErroGeral(erro.message)
    }
  }

  return (
    <Card className={styles.card}>
      <p className={styles.aviso}>Não encontramos esse livro. Cadastre manualmente:</p>
      <form onSubmit={handleSubmit(aoSubmeter)} className={styles.formulario} noValidate>
        <Input label="Título" id="titulo" error={errors.titulo?.message} {...register('titulo')} />
        <Input label="Autor" id="autor" error={errors.autor?.message} {...register('autor')} />
        <Input label="Gênero" id="genero" error={errors.genero?.message} {...register('genero')} />
        <Textarea
          label="Sinopse"
          id="sinopse"
          error={errors.sinopse?.message}
          {...register('sinopse')}
        />
        <div className={styles.linha}>
          <Input
            label="Número de páginas"
            id="numeroPaginas"
            type="number"
            min="1"
            error={errors.numeroPaginas?.message}
            {...register('numeroPaginas')}
          />
          <Input
            label="Ano"
            id="ano"
            type="number"
            error={errors.ano?.message}
            {...register('ano')}
          />
        </div>
        {erroGeral ? (
          <p role="alert" className={styles.erroGeral}>
            {erroGeral}
          </p>
        ) : null}
        <Button type="submit" variant="primary" disabled={enviando}>
          {enviando ? 'Cadastrando...' : 'Cadastrar livro'}
        </Button>
      </form>
    </Card>
  )
}

export { ManualBookForm }
