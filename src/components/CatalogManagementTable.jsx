import { Merge } from 'lucide-react'

import { BookCoverThumb } from './BookCoverThumb'
import { Button } from './Button'
import { Card } from './Card'
import styles from '../styles/components/CatalogManagementTable.module.css'

/**
 * Gestão de Catálogo (#22) — lista de livros com ação administrativa de mesclagem. **Não é um
 * `<table>` HTML**, apesar do nome (mesmo nome que o roadmap usa): o `Lythra Design System/
 * readme.md` é explícito — dado tabular no Lythra é sempre cards empilhados, nunca grid de linhas
 * retas ("contradiz a linguagem clay... e resolve responsividade mobile de graça"), mesma regra que
 * já vale pra qualquer lista do projeto (`ShelfGrid`, `FollowList`...). Edição de campo a campo do
 * livro não está no escopo desta etapa (roadmap só pede "editar, mesclar duplicados" no nível de
 * ação administrativa — o próprio formulário de edição de livro não tem página dedicada em nenhuma
 * etapa do roadmap; `ManualBookForm`, Etapa 12, é só criação); mesclar é a única ação implementada
 * aqui, "editar" no sentido de já poder trocar `livroId` de referências é o que a mesclagem faz.
 * @param {{ livros: object[], onMesclar: (livro: object) => void }} props
 */
function CatalogManagementTable({ livros, onMesclar }) {
  return (
    <div className={styles.lista}>
      {livros.map((livro) => (
        <Card key={livro.id} className={styles.linha}>
          <BookCoverThumb src={livro.capaUrl} title={livro.titulo} size="sm" />
          <div className={styles.info}>
            <span className={styles.titulo}>{livro.titulo}</span>
            <span className={styles.detalhe}>
              {livro.autor} · {livro.genero}
            </span>
            <span className={styles.detalhe}>
              {livro.totalAvaliacoes}{' '}
              {livro.totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onMesclar(livro)}>
            <Merge size={16} aria-hidden="true" />
            Mesclar com...
          </Button>
        </Card>
      ))}
    </div>
  )
}

export { CatalogManagementTable }
