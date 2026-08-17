import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useConfiguracoesDoSistema } from '../hooks/useConfiguracoesDoSistema'
import { Button } from './Button'
import { Card } from './Card'
import { Input } from './Input'
import { LoadingList } from './LoadingList'
import styles from '../styles/components/SystemSettingsForm.module.css'

const esquema = z.object({
  nomeDaPlataforma: z.string().min(1, 'Informe o nome da plataforma.'),
  emailDeSuporte: z.string().email('Informe um e-mail válido.'),
  permiteNovosCadastros: z.boolean(),
})

/**
 * Configurações do Sistema (#24) — parâmetros globais mockados (Descrição da Etapa 19: "formulário
 * simples de parâmetros globais"). Sem checkbox dedicado (mesma decisão já tomada em `CadastroForm`,
 * Etapa 9, e em `ConfiguracoesPage`/`PrivacyToggle`, Etapa 18) — aqui é um `<input type="checkbox">`
 * nativo, simples o bastante pra não justificar um componente novo.
 *
 * `reset(dado)` no `useEffect` popula o formulário assim que a leitura (`useConfiguracoesDoSistema`)
 * resolve — RHF não sabe reagir sozinho a um `defaultValues` que só existe depois do primeiro
 * render (a leitura é assíncrona), então o formulário nasce vazio e é preenchido no efeito, mesmo
 * problema (e mesma solução) que qualquer formulário de edição neste projeto teria.
 */
function SystemSettingsForm() {
  const [erroGeral, setErroGeral] = useState(null)
  const [sucesso, setSucesso] = useState(false)
  const { dado, carregando, salvar, salvando } = useConfiguracoesDoSistema()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(esquema) })

  useEffect(() => {
    if (dado) reset(dado)
  }, [dado, reset])

  async function aoSubmeter(dados) {
    setErroGeral(null)
    setSucesso(false)
    try {
      await salvar(dados)
      setSucesso(true)
    } catch (erro) {
      setErroGeral(erro.message)
    }
  }

  if (carregando && !dado) {
    return (
      <Card className={styles.card}>
        <LoadingList count={1} />
      </Card>
    )
  }

  return (
    <Card className={styles.card}>
      <h2 className={styles.titulo}>Configurações do sistema</h2>
      <form onSubmit={handleSubmit(aoSubmeter)} className={styles.formulario} noValidate>
        <Input
          label="Nome da plataforma"
          id="nomeDaPlataforma"
          error={errors.nomeDaPlataforma?.message}
          {...register('nomeDaPlataforma')}
        />
        <Input
          label="E-mail de suporte"
          id="emailDeSuporte"
          type="email"
          error={errors.emailDeSuporte?.message}
          {...register('emailDeSuporte')}
        />
        <label htmlFor="permiteNovosCadastros" className={styles.campoCheckbox}>
          <input
            type="checkbox"
            id="permiteNovosCadastros"
            className={styles.checkbox}
            {...register('permiteNovosCadastros')}
          />
          Permitir novos cadastros na plataforma
        </label>
        {erroGeral ? (
          <p role="alert" className={styles.erroGeral}>
            {erroGeral}
          </p>
        ) : null}
        {sucesso ? (
          <p role="status" className={styles.sucesso}>
            Configurações salvas com sucesso.
          </p>
        ) : null}
        <Button type="submit" variant="primary" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar configurações'}
        </Button>
      </form>
    </Card>
  )
}

export { SystemSettingsForm }
