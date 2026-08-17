import { Modal } from './Modal'
import styles from '../styles/components/TermosDeUsoModal.module.css'

/**
 * Conteúdo estático dos Termos de Uso e Privacidade, alinhado à Lei Geral de Proteção de Dados
 * (Lei nº 13.709/2018 — LGPD): identifica o controlador, a base legal do tratamento, os dados
 * coletados e os direitos do titular (Art. 18 da LGPD).
 *
 * TEORIA: "CASCA" (SHELL) x "CONTEÚDO" — COMPOSIÇÃO EM VEZ DE HERANÇA
 * ---------------------------------------------------------------------------
 * Este componente compõe `Modal` (Etapa 4) em vez de reimplementar sozinho
 * qualquer parte de "ser um modal". Isso ilustra um princípio central de
 * React: preferir COMPOSIÇÃO (um componente usa outro componente como
 * "caixa" ao redor do seu próprio conteúdo) a reescrever comportamento já
 * pronto. `Modal` já resolve todo o trabalho difícil e repetitivo de
 * acessibilidade — fechar com `Esc`, mover o foco do teclado pra dentro do
 * diálogo ao abrir e de volta pra fora ao fechar, `role="dialog"`,
 * `aria-modal`, `aria-labelledby` apontando pro título — e `TermosDeUsoModal`
 * não precisa saber NADA disso. A única responsabilidade que sobra aqui é
 * a mais simples possível: que texto mostrar. Se um dia outro modal de
 * texto longo for necessário (por exemplo, uma Política de Cookies), o
 * padrão a seguir é exatamente este — um componente pequeno, só de
 * conteúdo, compondo o mesmo `Modal` já testado.
 *
 * @param {{ open: boolean, onClose: () => void }} props
 */
function TermosDeUsoModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Termos de Uso e Privacidade">
      <div className={styles.conteudo}>
        <p className={styles.atualizacao}>Última atualização: 28 de julho de 2026.</p>

        <section>
          <h4 className={styles.secao}>1. Quem somos</h4>
          <p>
            O Lythra ("nós") é uma rede social de leitura. Ao criar uma conta, você concorda com
            estes Termos de Uso e com o tratamento dos seus dados pessoais descrito abaixo, em
            conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
          </p>
        </section>

        <section>
          <h4 className={styles.secao}>2. Dados que coletamos</h4>
          <ul className={styles.lista}>
            <li>Dados de cadastro: nome, e-mail e senha.</li>
            <li>
              Dados de uso: livros avaliados, estante de leitura, atividades no feed e pessoas que
              você segue.
            </li>
            <li>Dados opcionais: foto de perfil e biografia, se você optar por preenchê-los.</li>
          </ul>
        </section>

        <section>
          <h4 className={styles.secao}>3. Para que usamos seus dados</h4>
          <p>
            Usamos seus dados para operar sua conta, exibir seu perfil e estante conforme a sua
            configuração de privacidade, e calcular suas estatísticas de leitura. A base legal é a
            execução do contrato firmado com você ao criar a conta (Art. 7º, V, LGPD).
          </p>
        </section>

        <section>
          <h4 className={styles.secao}>4. Com quem compartilhamos</h4>
          <p>
            Não vendemos seus dados pessoais a terceiros. Informações marcadas como públicas
            (perfil, estante, avaliações) ficam visíveis a outros usuários, conforme a configuração
            de privacidade em Configurações da Conta.
          </p>
        </section>

        <section>
          <h4 className={styles.secao}>5. Seus direitos (Art. 18 da LGPD)</h4>
          <p>Você pode, a qualquer momento:</p>
          <ul className={styles.lista}>
            <li>confirmar a existência de tratamento e acessar seus dados;</li>
            <li>corrigir dados incompletos, inexatos ou desatualizados;</li>
            <li>solicitar anonimização, bloqueio ou eliminação de dados desnecessários;</li>
            <li>solicitar a portabilidade dos seus dados a outro serviço;</li>
            <li>revogar seu consentimento e excluir sua conta, a qualquer momento;</li>
            <li>obter informação sobre com quem compartilhamos seus dados.</li>
          </ul>
          <p>
            Esses direitos podem ser exercidos em Configurações da Conta ou pelo e-mail{' '}
            <a href="mailto:privacidade@lythra.com">privacidade@lythra.com</a>.
          </p>
        </section>

        <section>
          <h4 className={styles.secao}>6. Retenção e exclusão</h4>
          <p>
            Mantemos seus dados enquanto sua conta estiver ativa. Ao excluir sua conta, seus dados
            de identificação são removidos; avaliações e atividades já publicadas podem ser mantidas
            desvinculadas da sua identidade, para preservar o histórico de quem interagiu com elas.
          </p>
        </section>

        <p className={styles.aviso}>
          Este é um projeto didático (SENAC — Desenvolvedor Full Stack). Nenhum dado é enviado a
          servidores reais; tudo é simulado e armazenado só no seu navegador.
        </p>
      </div>
    </Modal>
  )
}

export { TermosDeUsoModal }
