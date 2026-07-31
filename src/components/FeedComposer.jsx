import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BookOpen, ImageUp, X } from 'lucide-react'
import { z } from 'zod'

import { useAuth } from '../context/AuthContext'
import { useCriarPost } from '../hooks/useCriarPost'
import { BookCoverThumb } from './BookCoverThumb'
import { Button } from './Button'
import { Card } from './Card'
import { EscolherLivroModal } from './EscolherLivroModal'
import { Textarea } from './Textarea'
import styles from '../styles/components/FeedComposer.module.css'

const esquema = z.object({
  texto: z.string().min(1, 'Escreva algo pra compartilhar.'),
})

/**
 * Topo do Feed — publicar uma atualização de texto livre (formulário RHF+Zod, mesmo padrão de
 * `ReviewForm`/`ManualBookForm`), com dois anexos opcionais: um livro da própria estante
 * (`EscolherLivroModal`, reaproveita `useEstante`/`useLivros` da Etapa 13) e uma foto (mesmo padrão
 * de upload via `FileReader`/data URL já usado em `ManualBookForm` pra capa de livro, Etapa 12 —
 * sem backend real, a própria string base64 vira `fotoUrl`). `livroId`/`fotoUrl` ficam fora do
 * schema Zod (não passam por `register()`, são anexos opcionais sem validação própria) e só entram
 * no payload da mutation se de fato escolhidos.
 *
 * Dono da própria mutation (`useCriarPost`), mesmo padrão de `ManualBookForm` possuindo
 * `useCadastrarLivro`.
 * @param {{ onPublicado: () => void }} props
 */
function FeedComposer({ onPublicado }) {
  const { usuario } = useAuth()
  const [erroGeral, setErroGeral] = useState(null)
  const [livroAnexado, setLivroAnexado] = useState(null)
  const [fotoAnexada, setFotoAnexada] = useState(null)
  const [modalLivroAberto, setModalLivroAberto] = useState(false)

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
    setLivroAnexado(null)
    setFotoAnexada(null)
    onPublicado()
  })

  function aoSelecionarFoto(evento) {
    const arquivo = evento.target.files?.[0]
    if (!arquivo || !arquivo.type.startsWith('image/')) return

    const leitor = new FileReader()
    leitor.onload = () => setFotoAnexada(leitor.result)
    leitor.readAsDataURL(arquivo)
  }

  async function aoSubmeter(dados) {
    setErroGeral(null)
    try {
      await publicar({
        tipo: 'post-livre',
        usuarioId: usuario.id,
        texto: dados.texto,
        ...(livroAnexado ? { livroId: livroAnexado.id } : {}),
        ...(fotoAnexada ? { fotoUrl: fotoAnexada } : {}),
      })
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

        {livroAnexado ? (
          <div className={`${styles.anexo} ${styles.anexoLivro}`}>
            <span className={styles.anexoTitulo}>{livroAnexado.titulo}</span>
            <BookCoverThumb src={livroAnexado.capaUrl} title={livroAnexado.titulo} size="sm" />
            <button
              type="button"
              className={styles.removerAnexo}
              onClick={() => setLivroAnexado(null)}
              aria-label="Remover livro anexado"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        ) : null}

        {fotoAnexada ? (
          <div className={styles.anexo}>
            <img src={fotoAnexada} alt="Pré-visualização da foto anexada" className={styles.foto} />
            <button
              type="button"
              className={styles.removerAnexo}
              onClick={() => setFotoAnexada(null)}
              aria-label="Remover foto anexada"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        ) : null}

        {erroGeral ? (
          <p role="alert" className={styles.erroGeral}>
            {erroGeral}
          </p>
        ) : null}

        <div className={styles.acoes}>
          <div className={styles.anexosBotoes}>
            <button
              type="button"
              className={styles.botaoAnexo}
              onClick={() => setModalLivroAberto(true)}
              aria-label="Anexar livro da estante"
            >
              <BookOpen size={18} aria-hidden="true" />
            </button>
            <label className={styles.botaoAnexo} aria-label="Adicionar foto">
              <ImageUp size={18} aria-hidden="true" />
              <input
                type="file"
                accept="image/*"
                className={styles.inputEscondido}
                onChange={aoSelecionarFoto}
              />
            </label>
          </div>
          <Button type="submit" variant="primary" disabled={enviando}>
            {enviando ? 'Publicando...' : 'Publicar'}
          </Button>
        </div>
      </form>

      <EscolherLivroModal
        open={modalLivroAberto}
        onClose={() => setModalLivroAberto(false)}
        onSelecionar={setLivroAnexado}
      />
    </Card>
  )
}

export { FeedComposer }
