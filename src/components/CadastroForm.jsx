import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { useAuth } from '../context/AuthContext'
import { Button } from './Button'
import { Card } from './Card'
import { Input } from './Input'
import { TermosDeUsoModal } from './TermosDeUsoModal'
import styles from '../styles/components/CadastroForm.module.css'

/*
 * Este formulário usa a mesma dupla React Hook Form + Zod já explicada em
 * detalhe em `LoginForm.jsx` (vale a pena ler aquele arquivo primeiro se os
 * conceitos de `register`/`zodResolver`/`isSubmitting` ainda não estiverem
 * claros). Aqui, dois recursos NOVOS do Zod entram em cena, porque o
 * Cadastro precisa validar coisas que o Login não precisa:
 *
 * TEORIA: `.refine()` — VALIDAÇÃO QUE DEPENDE DE MAIS DE UM CAMPO
 * ---------------------------------------------------------------------------
 * `z.string().min(6, '...')` valida UM campo isoladamente (a senha tem pelo
 * menos 6 caracteres?). Mas "a senha e a confirmação de senha são iguais?"
 * é uma regra que depende de DOIS campos ao mesmo tempo — não dá pra
 * expressar isso dentro da definição de um campo só. É pra isso que existe
 * `.refine()` no NÍVEL DO OBJETO INTEIRO (depois do `z.object({...})`, não
 * dentro dele): recebe uma função que vê TODOS os campos já validados
 * individualmente (`dados => dados.senha === dados.confirmarSenha`) e
 * decide se o conjunto inteiro é válido. `path: ['confirmarSenha']` diz ao
 * Zod ONDE mostrar a mensagem de erro resultante — sem isso, o erro
 * apareceria "solto", sem saber embaixo de qual campo exibi-lo.
 *
 * O MESMO `.refine()`, USADO DE FORMA DIFERENTE: UM CHECKBOX OBRIGATÓRIO
 * ---------------------------------------------------------------------------
 * `aceiteTermos: z.boolean().refine((valor) => valor === true, {...})` usa
 * `.refine()` dentro de UM campo só (não no objeto inteiro) — aqui ele
 * resolve um problema diferente: `z.boolean()` sozinho aceita tanto `true`
 * quanto `false` como "válido" (os dois são, afinal, booleanos de verdade).
 * Mas a REGRA DE NEGÓCIO é "só `true` é aceitável" (a pessoa precisa ter
 * marcado o aceite) — `.refine()` é o jeito de expressar essa regra extra,
 * específica do produto, que o tipo `boolean` sozinho não capturaria.
 *
 * POR QUE O CHECKBOX NÃO USA `forwardRef`/COMPONENTE PRÓPRIO
 * ---------------------------------------------------------------------------
 * Repare que o campo de aceite de termos é um `<input type="checkbox">`
 * NATIVO, direto no JSX — não um componente `Checkbox` customizado como
 * `Input`/`Textarea`. Isso é intencional: `register('aceiteTermos')` já
 * funciona perfeitamente num `<input>` nativo sem precisar de
 * `forwardRef` nenhum (a necessidade de `forwardRef`, explicada em
 * `LoginForm.jsx`, é só para COMPONENTES React que envolvem um input —
 * um elemento HTML nativo já expõe seu próprio `ref` diretamente). Criar
 * um componente `Checkbox` só para este único uso seria complexidade a
 * mais sem necessidade real (mesma filosofia de simplicidade do projeto:
 * "se uma solução exige abstração pesada pra funcionar, não é a solução
 * certa aqui").
 */

const esquema = z
  .object({
    nome: z.string().min(1, 'Informe seu nome.'),
    email: z.string().min(1, 'Informe seu e-mail.').email('E-mail inválido.'),
    senha: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres.'),
    confirmarSenha: z.string().min(1, 'Confirme sua senha.'),
    aceiteTermos: z
      .boolean()
      .refine((valor) => valor === true, { message: 'É preciso aceitar os termos de uso.' }),
  })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    message: 'As senhas não conferem.',
    path: ['confirmarSenha'],
  })

/** Toda conta criada por aqui nasce papel `leitor` (`usuarioService.criar`, Etapa 7 — conta de
 * administrador não é autoatendimento). Erro de e-mail já cadastrado vem de `useAuth().cadastrar`
 * propagando a exceção de `usuarioService.criar`, diferente de `LoginForm`: aqui é uma falha real
 * (e-mail duplicado é algo que "não deveria" acontecer no fluxo feliz), não um fluxo esperado como
 * "senha errada" — por isso é tratado com `try/catch` em vez de checar um retorno `null`. */
function CadastroForm() {
  const { cadastrar } = useAuth()
  const navigate = useNavigate()
  const [erroCadastro, setErroCadastro] = useState(null)
  // Estado do MODAL de termos, controlado por este componente (não pelo `TermosDeUsoModal` — ele
  // só recebe `open`/`onClose` como props, sem guardar seu próprio estado de "estou aberto ou
  // fechado"). Esse padrão ("componente controlado", o mesmo princípio por trás de `register()`,
  // só que aplicado a um modal em vez de um campo de texto) mantém `TermosDeUsoModal` simples e
  // previsível: ele nunca decide sozinho quando aparecer, só obedece a quem o está usando.
  const [termosAbertos, setTermosAbertos] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(esquema), defaultValues: { aceiteTermos: false } })

  async function aoSubmeter(dados) {
    setErroCadastro(null)
    try {
      await cadastrar({ nome: dados.nome, email: dados.email, senha: dados.senha })
      navigate('/feed')
    } catch (erro) {
      setErroCadastro(erro.message)
    }
  }

  return (
    <Card className={styles.card}>
      <h1 className={styles.titulo}>Criar conta</h1>
      <form onSubmit={handleSubmit(aoSubmeter)} className={styles.formulario} noValidate>
        <Input
          label="Nome"
          id="nome"
          placeholder="Seu nome"
          autoComplete="name"
          error={errors.nome?.message}
          {...register('nome')}
        />
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
          autoComplete="new-password"
          error={errors.senha?.message}
          {...register('senha')}
        />
        <Input
          label="Confirmar senha"
          id="confirmarSenha"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.confirmarSenha?.message}
          {...register('confirmarSenha')}
        />
        <div className={styles.termosCampo}>
          <label className={styles.termos}>
            <input type="checkbox" className={styles.checkbox} {...register('aceiteTermos')} />
            <span>
              Ao continuar, você aceita os{' '}
              {/* `type="button"` aqui não é decoração — sem ele, um `<button>` dentro de um
               * `<form>` assume o comportamento padrão `type="submit"` e TENTARIA enviar o
               * formulário inteiro só de clicar em "termos de uso", antes mesmo da pessoa ler nada.
               * O visual de link (sem cara de botão) vem do CSS, ver `CadastroForm.module.css`. */}
              <button
                type="button"
                className={styles.linkTermos}
                onClick={() => setTermosAbertos(true)}
              >
                termos de uso
              </button>{' '}
              do Lythra.
            </span>
          </label>
          {errors.aceiteTermos ? (
            <span role="alert" className={styles.erroTermos}>
              {errors.aceiteTermos.message}
            </span>
          ) : null}
        </div>
        {erroCadastro ? (
          <p role="alert" className={styles.erroGeral}>
            {erroCadastro}
          </p>
        ) : null}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>
      <p className={styles.rodape}>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
      <TermosDeUsoModal open={termosAbertos} onClose={() => setTermosAbertos(false)} />
    </Card>
  )
}

export { CadastroForm }
