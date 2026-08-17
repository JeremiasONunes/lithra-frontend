import { LandingCTA } from '../components/LandingCTA'
import { LandingFeatures } from '../components/LandingFeatures'
import { LandingHero } from '../components/LandingHero'
import styles from '../styles/pages/LandingPage.module.css'

/**
 * Landing Page (#1) — a porta de entrada pública do produto (rota `/`).
 *
 * TEORIA: POR QUE UMA "PÁGINA" É QUASE SEMPRE UM ARQUIVO PEQUENO
 * ---------------------------------------------------------------------------
 * Repare que este arquivo não tem nenhuma lógica — não lê dado, não tem
 * `useState`, não valida nada. Isso é intencional, e é a mesma separação de
 * responsabilidades que `01-arquitetura-frontend.md` define para todo o
 * projeto: uma PÁGINA (pasta `pages/`) só COMPÕE — decide qual sequência de
 * componentes aparece numa rota e aplica o layout de mais alto nível (aqui,
 * `styles.wrapper`, uma coluna vertical). Toda a lógica de fato (o que
 * mostrar, como validar um formulário, o que acontece ao clicar) mora dentro
 * de cada COMPONENTE (pasta `components/`) chamado aqui.
 *
 * Por que separar assim, em vez de escrever tudo direto nesta página? Duas
 * razões práticas:
 *   1. Um componente como `LandingHero` fica testável e reutilizável de
 *      forma isolada, sem precisar montar a página inteira em volta dele.
 *   2. Quem abre este arquivo entende a ESTRUTURA da tela (o quê aparece, em
 *      que ordem) sem precisar ler a implementação de cada parte — o mesmo
 *      benefício de um sumário de livro antes de ler os capítulos.
 *
 * A Landing Page em si não busca nenhum dado (não usa `useAsync`/hook de
 * leitura) — é a única "página" do produto cujo conteúdo é 100% estático,
 * porque seu público é sempre um visitante ainda sem sessão.
 */
function LandingPage() {
  return (
    <div className={styles.wrapper}>
      <LandingHero />
      <LandingFeatures />
      <LandingCTA />
    </div>
  )
}

export { LandingPage }
