import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { useAuth } from '../context/AuthContext'
import { Button } from './Button'
import { Card } from './Card'
import { Input } from './Input'
import styles from '../styles/components/LoginForm.module.css'

/*
 * TEORIA: POR QUE UMA BIBLIOTECA DE FORMULÁRIO (REACT HOOK FORM)?
 * ---------------------------------------------------------------------------
 * Um formulário React "na mão" (sem biblioteca) normalmente guarda cada
 * campo em um `useState` próprio, e a cada tecla digitada o componente
 * inteiro re-renderiza pra refletir o novo valor — funciona, mas escala mal
 * (um formulário de 10 campos vira 10 `useState`s, cada tecla causa um
 * re-render). O React Hook Form (RHF) resolve isso com campos NÃO
 * controlados: em vez de guardar o valor no estado do React a cada tecla,
 * ele lê o valor DIRETO do DOM só quando precisa (na submissão, ou quando
 * pedido explicitamente) — usando `ref`, não `useState`+`onChange`. Isso é
 * o motivo de todo campo de formulário deste projeto (`Input`, `Textarea`)
 * precisar de `forwardRef` (ver `01-arquitetura-frontend.md`): sem o
 * `ref` chegando no `<input>` real do DOM, o RHF não tem como ler o valor.
 *
 * `register('email')` devolve um conjunto de props (`name`, `ref`,
 * `onChange`, `onBlur`) que, espalhadas no `<Input {...register('email')} />`,
 * conectam aquele campo específico ao formulário — é assim que o RHF sabe
 * "este input pertence ao campo `email`".
 *
 * TEORIA: ZOD — VALIDAÇÃO DECLARADA COMO UM SCHEMA, NÃO COMO `if`s SOLTOS
 * ---------------------------------------------------------------------------
 * `z.object({ email: z.string().email(...), senha: z.string().min(1, ...) })`
 * descreve o FORMATO esperado dos dados (um "schema") e as regras de cada
 * campo, em vez de uma sequência de `if (!email) erro = "..."` espalhada
 * pelo código. `zodResolver(esquema)` é a peça que TRADUZ esse schema Zod
 * para o formato que o RHF entende — sem essa ponte, as duas bibliotecas
 * não teriam como conversar (RHF não sabe nada de Zod nativamente, e
 * vice-versa; `zodResolver` é o "adaptador" entre as duas). O resultado:
 * `errors.email?.message` já vem pronto, calculado automaticamente a cada
 * tentativa de envio.
 *
 * `formState.isSubmitting`: ESTADO DE ENVIO "DE GRAÇA"
 * ---------------------------------------------------------------------------
 * O RHF já rastreia sozinho se uma submissão assíncrona está em andamento
 * (`isSubmitting`, dentro de `formState`) — não precisa de um `useState`
 * manual só pra isso. É usado aqui pra desabilitar o botão e trocar o
 * texto ("Entrando...") enquanto a Promise de `login()` não resolve,
 * evitando um duplo-clique acidental enviando o formulário duas vezes.
 */

const esquema = z.object({
  email: z.string().min(1, 'Informe seu e-mail.').email('E-mail inválido.'),
  senha: z.string().min(1, 'Informe sua senha.'),
})

/** `useAuth().login` nunca lança erro pra credencial inválida (mesmo contrato de
 * `usuarioService.verificarCredenciais`, Etapa 7/8) — retorna `null`, tratado aqui como erro geral
 * do formulário, não de um campo específico. Esse é um erro DIFERENTE dos erros de validação do Zod
 * acima: validação do Zod ("e-mail em formato inválido") acontece ANTES de qualquer requisição, só
 * olhando o que foi digitado; erro de credencial só é conhecido DEPOIS de perguntar pro "back-end"
 * (aqui, o mock) se aquele e-mail/senha realmente existem — por isso mora num `useState` próprio
 * (`erroCredenciais`), fora do controle do RHF, que só sabe validar formato. */
function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [erroCredenciais, setErroCredenciais] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(esquema) })

  // `handleSubmit` (do RHF) só chama esta função se a validação do Zod já passou — dentro dela,
  // `dados` já vem no formato validado, sem precisar checar de novo se `email`/`senha` existem.
  async function aoSubmeter(dados) {
    setErroCredenciais(null)
    const usuario = await login(dados.email, dados.senha)

    if (!usuario) {
      setErroCredenciais('E-mail ou senha incorretos.')
      return
    }

    // Redirecionamento condicional por papel — o mesmo formulário de login serve tanto pra um
    // Leitor quanto para um Administrador; a diferença é só pra onde a pessoa vai depois de entrar.
    navigate(usuario.papel === 'administrador' ? '/admin' : '/feed')
  }

  return (
    <Card className={styles.card}>
      <h1 className={styles.titulo}>Entrar</h1>
      {/* Credenciais de teste temporárias — remover antes de produção real (dados da fixture de
       * usuarioService, Etapa 7). */}
      <div className={styles.credenciaisTeste}>
        <p className={styles.credenciaisTitulo}>Credenciais de teste (temporário)</p>
        <p>
          <strong>Leitor:</strong> mariana@exemplo.com / senha123
        </p>
        <p>
          <strong>Administrador:</strong> admin@lythra.com / admin123
        </p>
      </div>
      {/* `noValidate` desliga a validação NATIVA do navegador (o balãozinho "Preencha este campo"
       * do HTML) — o formulário já tem sua própria validação, via Zod, com mensagens no mesmo
       * estilo visual do resto do produto; sem `noValidate`, as duas validações (navegador + Zod)
       * apareceriam ao mesmo tempo, competindo uma com a outra. */}
      <form onSubmit={handleSubmit(aoSubmeter)} className={styles.formulario} noValidate>
        <Input
          label="E-mail"
          id="email"
          type="email"
          placeholder="voce@exemplo.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Senha"
          id="senha"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.senha?.message}
          {...register('senha')}
        />
        {erroCredenciais ? (
          // `role="alert"`: avisa leitores de tela IMEDIATAMENTE quando este parágrafo aparece,
          // sem exigir que a pessoa navegue até ele pra descobrir que algo deu errado — o mesmo
          // papel de acessibilidade que uma mensagem de erro visualmente em destaque já cumpre pra
          // quem enxerga a tela.
          <p role="alert" className={styles.erroGeral}>
            {erroCredenciais}
          </p>
        ) : null}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
      <p className={styles.rodape}>
        Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
      <p className={styles.rodape}>
        <Link to="/recuperar-senha">Esqueci minha senha</Link>
      </p>
    </Card>
  )
}

export { LoginForm }
