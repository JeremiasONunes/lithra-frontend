import { Link, useLocation } from 'react-router-dom'

import logo from '../assets/logo.png'
import styles from '../styles/components/AuthHeader.module.css'

/**
 * Cabeçalho compartilhado pelas 4 telas públicas (Landing, Login, Cadastro, Recuperar Senha).
 *
 * TEORIA: POR QUE ISTO NÃO APARECE DENTRO DE `LandingPage`/`LoginPage`/...
 * ---------------------------------------------------------------------------
 * `AuthHeader` é renderizado UMA VEZ dentro de `PublicLayout` — o componente
 * "casca" que envolve as 4 rotas públicas (`routes/routeConfig.jsx`) — e não
 * dentro de cada página individualmente. Isso é o princípio DRY (Don't
 * Repeat Yourself) aplicado a componentes de layout: se cada página
 * importasse `AuthHeader` por conta própria, ele existiria 4 vezes no
 * código-fonte fazendo a mesma coisa. Ao morar no layout compartilhado, ele
 * existe uma vez só, e qualquer mudança nele (trocar a logo, adicionar um
 * link) se reflete nas 4 telas automaticamente.
 *
 * `useLocation` (React Router): UM HOOK PARA LER A URL ATUAL
 * ---------------------------------------------------------------------------
 * `useLocation()` devolve informação sobre a rota em que o app está agora
 * (`{ pathname, search, hash, ... }`) — é assim que um componente sabe "em
 * que tela eu estou" sem precisar receber essa informação via prop. Aqui,
 * `pathname` decide se o link "Entrar" aparece: ele é escondido só na
 * própria página de Login (`pathname === '/login'`) — não faria sentido
 * mostrar "Entrar" pra quem já está na tela de entrar — e continua visível
 * nas outras 3 telas públicas, garantindo que quem já tem conta sempre
 * encontra o caminho de volta pro login a partir de qualquer uma delas.
 *
 * ACESSIBILIDADE: `alt=""` NÃO É UM ESQUECIMENTO
 * ---------------------------------------------------------------------------
 * Toda imagem de CONTEÚDO precisa de um `alt` descritivo (regra do projeto,
 * `01-arquitetura-frontend.md`) — mas esta logo é DECORATIVA nesse
 * contexto específico: o texto "Lythra" já está escrito ao lado dela
 * (`.nome`), então um leitor de tela que descrevesse a imagem de novo
 * ("logo do Lythra") apenas repetiria uma informação que a pessoa acabou de
 * ouvir. `alt=""` (vazio, não ausente) é a forma correta e intencional de
 * dizer "esta imagem é puramente visual, pule-a" — different de simplesmente
 * não escrever o atributo `alt`, o que faria alguns leitores de tela lerem
 * o caminho do arquivo em voz alta.
 *
 * CSS PRÓPRIO EM VEZ DE REUTILIZAR `Button` — UM CASO REAL DE ESPECIFICIDADE CSS
 * ---------------------------------------------------------------------------
 * O link "Entrar" TEM a mesma forma visual de pílula do `Button` variante
 * `ghost`, mas não importa as classes de `Button.module.css` — ver a
 * explicação completa (com a história do bug de contraste que motivou essa
 * escolha) no comentário de `AuthHeader.module.css`.
 */
function AuthHeader() {
  const { pathname } = useLocation()

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.marca}>
        <img src={logo} alt="" className={styles.logo} />
        <span className={styles.nome}>Lythra</span>
      </Link>
      {pathname !== '/login' ? (
        <Link to="/login" className={styles.entrar}>
          Entrar
        </Link>
      ) : null}
    </header>
  )
}

export { AuthHeader }
