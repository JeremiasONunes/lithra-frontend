import { Link } from 'react-router-dom'

import logo from '../assets/logo.png'
import buttonStyles from '../styles/components/Button.module.css'
import styles from '../styles/components/LandingHero.module.css'

/**
 * Bloco principal da Landing Page — logo, título, subtítulo e a chamada
 * para ação de maior destaque da tela (Etapa 9).
 *
 * TEORIA: POR QUE `Link`, E NÃO `<button onClick={navigate}>`
 * ---------------------------------------------------------------------------
 * Existem duas formas de "ir para outra tela" em React Router:
 *   1. `<Link to="/cadastro">` — renderiza uma tag `<a>` de verdade por
 *      baixo, com um `href` real.
 *   2. `<button onClick={() => navigate('/cadastro')}>` — dispara a
 *      navegação via JavaScript, sem nenhum `href`.
 * A escolha aqui é `Link` porque a ação É literalmente navegação (trocar de
 * rota, sem nenhum efeito colateral antes) — o mesmo tipo de ação que um
 * link de página HTML sempre fez. Usar um `<a>`/`Link` de verdade preserva
 * de graça um conjunto de comportamentos que o navegador só dá a elementos
 * `<a>`: abrir em nova guia (Ctrl/Cmd+clique), abrir em nova janela (clique
 * do botão do meio/direito → "Abrir em nova guia"), copiar o endereço do
 * link, e navegação por teclado tratando o elemento como o que ele
 * realmente é. Um `<button>` com `onClick` quebraria todos esses
 * comportamentos — o usuário não teria como, por exemplo, abrir a página de
 * cadastro numa aba nova.
 *
 * REAPROVEITANDO CSS DE OUTRO COMPONENTE, SEM IMPORTAR O COMPONENTE
 * ---------------------------------------------------------------------------
 * Repare que este arquivo importa `Button.module.css` (as CLASSES CSS do
 * botão), mas NÃO importa o componente `Button` em si. Isso é proposital:
 * `Link` já é o elemento certo (parágrafo acima), então não faz sentido
 * envolvê-lo dentro de um `<Button>` (que renderiza um `<button>`) só para
 * pegar aparência — bastava pegar a APARÊNCIA (as classes CSS Module) e
 * aplicá-la diretamente no `Link`. `${buttonStyles.button} ${buttonStyles.primary} ${buttonStyles.lg}`
 * é exatamente a mesma combinação de classes que `<Button variant="primary" size="lg">`
 * geraria por dentro — o visual final é idêntico, mas o elemento HTML é o
 * correto para uma navegação.
 */
function LandingHero() {
  return (
    <section className={styles.hero}>
      <img src={logo} alt="Lythra" className={styles.logo} />
      <h1 className={styles.titulo}>Sua estante, seu ritmo.</h1>
      <p className={styles.subtitulo}>
        Registre o que você lê, avalie, acompanhe suas estatísticas e descubra novos livros através
        de quem você segue.
      </p>
      <Link
        to="/cadastro"
        className={`${buttonStyles.button} ${buttonStyles.primary} ${buttonStyles.lg}`}
      >
        Comece a ler com a gente
      </Link>
    </section>
  )
}

export { LandingHero }
