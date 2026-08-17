import { BarChart2, BookOpen, Sparkles, Users } from 'lucide-react'

import { Card } from './Card'
import { IconChip } from './IconChip'
import styles from '../styles/components/LandingFeatures.module.css'

/**
 * TEORIA: DADOS SEPARADOS DO JSX (RENDERIZAÇÃO "DATA-DRIVEN")
 * ---------------------------------------------------------------------------
 * Repare que os 4 cards de funcionalidade NÃO estão escritos como 4 blocos
 * JSX copiados e colados (`<Card>...</Card>` quatro vezes, um por
 * funcionalidade) — eles nascem de um ARRAY de dados (`FUNCIONALIDADES`),
 * percorrido com `.map()`. Essa técnica ("renderização orientada a dados")
 * é preferível sempre que vários elementos da tela têm a MESMA estrutura
 * visual e só mudam o conteúdo: em vez de repetir o JSX inteiro 4 vezes
 * (correndo o risco de uma cópia divergir da outra depois de uma edição),
 * a estrutura existe uma vez só, e os dados dizem o que preencher nela.
 * Adicionar uma 5ª funcionalidade no futuro vira uma linha nova no array,
 * não mais um bloco JSX inteiro copiado.
 *
 * Mesmas 4 funcionalidades de destaque da tela de referência do Design
 * System — "Recomendações por IA" reflete o módulo de Machine Learning já
 * previsto pro back-end (ver `CLAUDE.md`), não uma funcionalidade inventada
 * nesta etapa.
 */
const FUNCIONALIDADES = [
  { icon: BookOpen, titulo: 'Estante pessoal' },
  { icon: Users, titulo: 'Feed social' },
  { icon: BarChart2, titulo: 'Estatísticas' },
  { icon: Sparkles, titulo: 'Recomendações por IA' },
]

function LandingFeatures() {
  return (
    <section className={styles.grade}>
      {/* `key={titulo}` — TEORIA DA `key` EM LISTAS REACT: sempre que o
       * React renderiza uma lista via `.map()`, ele precisa de um jeito de
       * identificar CADA item de forma única e estável entre uma
       * renderização e a próxima — é assim que ele sabe "este item já
       * existia, só mudou de posição" versus "este é um item novo".
       * `titulo` funciona bem aqui porque os 4 títulos são fixos e nunca se
       * repetem (um índice numérico do array também funcionaria, mas é
       * evitado quando a lista pode ser reordenada/filtrada no futuro,
       * porque índice muda de valor quando a ordem muda — o `titulo` em si
       * não muda). Sem uma `key` (ou com uma `key` que se repete), o React
       * não tem garantia de qual elemento do DOM corresponde a qual item da
       * lista, e pode atualizar/reaproveitar o elemento errado. */}
      {FUNCIONALIDADES.map(({ icon, titulo }) => (
        <Card key={titulo} className={styles.item}>
          <IconChip icon={icon} tone="primary" />
          <span className={styles.titulo}>{titulo}</span>
        </Card>
      ))}
    </section>
  )
}

export { LandingFeatures }
