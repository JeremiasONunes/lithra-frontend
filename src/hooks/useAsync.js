import { useCallback, useEffect, useState } from 'react'

/**
 * Base de todo hook de leitura (`Página → Hook → Service`, ver `01-arquitetura-frontend.md`) — cada
 * hook específico (`useLivros`, `useAvaliacoes`... a partir da Etapa 9) chama isto por baixo em vez
 * de repetir o boilerplate de `carregando`/`erro`/`dado`.
 *
 * `funcaoAssincrona` precisa ser estável entre renders (envolvida em `useCallback` por quem chama)
 * — é dependência do efeito interno; se mudar a cada render, `useAsync` recarrega em loop.
 *
 * @param {() => Promise<unknown>} funcaoAssincrona - normalmente um método de `services/`, já
 *   memoizado pelo chamador
 * @returns {{ dado: unknown, carregando: boolean, erro: unknown, recarregar: () => void }}
 */
function useAsync(funcaoAssincrona) {
  const [dado, setDado] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  // Incrementada por `recarregar()` só pra disparar o efeito de novo — o próprio valor não é usado.
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let cancelado = false
    // `react-hooks/set-state-in-effect` (regra nova do eslint-plugin-react-hooks 7, ver Etapa 8 em
    // `progresso-implementacao.md`) marca isto como erro por padrão — mas "iniciar carregando ao
    // disparar uma busca" é exatamente o padrão que este hook existe pra formalizar (substitui o
    // TanStack Query, ver `01-arquitetura-frontend.md`). Desligada deliberadamente aqui, não em
    // todo o projeto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCarregando(true)
    setErro(null)

    funcaoAssincrona()
      .then((resultado) => !cancelado && setDado(resultado))
      .catch((e) => !cancelado && setErro(e))
      .finally(() => !cancelado && setCarregando(false))

    return () => {
      cancelado = true
    }
  }, [funcaoAssincrona, tentativa])

  const recarregar = useCallback(() => setTentativa((atual) => atual + 1), [])

  return { dado, carregando, erro, recarregar }
}

export { useAsync }
