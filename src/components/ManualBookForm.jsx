import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImageUp } from 'lucide-react'
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
  // Guarda o arquivo já convertido em data URL (string base64) — obrigatório, `min(1)` cobre "não
  // selecionou nenhum arquivo" (o campo começa vazio).
  capaUrl: z.string().min(1, 'Selecione uma imagem de capa.'),
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
 *
 * Capa é upload de arquivo, não URL — não existe backend real pra hospedar a imagem (projeto
 * 100% mockado até a Etapa 22), então o arquivo é lido como data URL (`FileReader`) e a própria
 * string base64 vira o `capaUrl` salvo em `localStorage`. `<input type="file">` não é um campo que
 * `register()` consiga ler direto (o valor nativo dele é um `FileList`, não a string que
 * `capaUrl` precisa guardar) — por isso fica fora de `register()`, com `setValue()` no
 * `onChange`/`onDrop`, mesmo padrão já usado pra `nota` (`RatingStars`) em `ReviewForm.jsx`.
 *
 * O `<input type="file">` real fica visualmente escondido (`.inputEscondido`) dentro de um
 * `<label>` estilizado como zona de arrastar-e-soltar (`.dropzone`) — clicar em qualquer parte do
 * `<label>` já abre o seletor nativo de arquivo (comportamento padrão do HTML pra
 * `<label htmlFor>` associado a um input), sem precisar de `ref`/`click()` manual; `onDrop` no
 * `<label>` cobre o caso de arrastar a imagem pra dentro.
 * @param {{ tituloInicial?: string, onCadastrado: (livro: object) => void }} props
 */
function ManualBookForm({ tituloInicial = '', onCadastrado }) {
  const [erroGeral, setErroGeral] = useState(null)
  const [arrastando, setArrastando] = useState(false)
  const { cadastrar, enviando } = useCadastrarLivro(onCadastrado)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(esquema),
    defaultValues: { titulo: tituloInicial, capaUrl: '' },
  })

  const capaPreview = watch('capaUrl')

  function processarArquivoDeCapa(arquivo) {
    if (!arquivo || !arquivo.type.startsWith('image/')) return

    const leitor = new FileReader()
    leitor.onload = () => {
      setValue('capaUrl', leitor.result, { shouldValidate: true })
    }
    leitor.readAsDataURL(arquivo)
  }

  function aoSelecionarCapa(evento) {
    processarArquivoDeCapa(evento.target.files?.[0])
  }

  function aoSoltarCapa(evento) {
    evento.preventDefault()
    setArrastando(false)
    processarArquivoDeCapa(evento.dataTransfer.files?.[0])
  }

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
        <div className={styles.campoCapa}>
          <span className={styles.labelCapa}>Capa do livro</span>
          <label
            htmlFor="capaArquivo"
            className={`${styles.dropzone} ${arrastando ? styles.dropzoneArrastando : ''} ${capaPreview ? styles.dropzoneComImagem : ''}`}
            onDragOver={(evento) => {
              evento.preventDefault()
              setArrastando(true)
            }}
            onDragLeave={() => setArrastando(false)}
            onDrop={aoSoltarCapa}
          >
            {capaPreview ? (
              <img src={capaPreview} alt="Pré-visualização da capa" className={styles.preview} />
            ) : (
              <span className={styles.dropzoneConteudo}>
                <ImageUp className={styles.dropzoneIcon} size={28} />
                <span className={styles.dropzoneTexto}>
                  Arraste a imagem aqui ou clique para enviar
                </span>
              </span>
            )}
            <input
              id="capaArquivo"
              type="file"
              accept="image/*"
              className={styles.inputEscondido}
              aria-invalid={!!errors.capaUrl}
              onChange={aoSelecionarCapa}
            />
          </label>
          {errors.capaUrl ? (
            <span role="alert" className={styles.erroCapa}>
              {errors.capaUrl.message}
            </span>
          ) : null}
        </div>
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
