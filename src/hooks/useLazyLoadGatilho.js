import { useCallback, useEffect, useRef } from 'react'

/**
 * Gatilho de lazy load reaproveitável, extraído do Feed (Etapa 14) pra também servir Buscar Livro e
 * Descobrir — mesmo mecanismo nas 3 telas: observa (via `IntersectionObserver` nativo) o penúltimo
 * item do lote mais recente; quando ele entra na tela, `aoCarregarMais` já dispara, antes do usuário
 * bater no fim de verdade. Como a posição do gatilho é recalculada a cada vez que a lista cresce, ela
 * "reinicia" sozinha a cada novo lote, sem lógica extra.
 *
 * `root` explícito (`elemento.closest('main')`): todo layout autenticado rola dentro de `<main>`
 * (`ReaderLayout`, `overflow-y: auto`), não a viewport inteira — sem isso, o observer (que por padrão
 * usa a viewport como referência) não detecta corretamente o scroll de um contêiner interno.
 *
 * `rootMargin` pequeno de propósito (bug real corrigido na Etapa 14/15: 600px chegava a cobrir a
 * lista inteira já na primeira renderização, carregando tudo de uma vez sem nenhuma sensação de
 * "lazy") — só antecipa o suficiente pra não esperar o usuário bater no pixel exato do fim.
 *
 * @param {{ temMais: boolean, quantidadeAtual: number, carregando: boolean, aoCarregarMais: () => void }} params
 * @returns {{ indiceGatilho: number, onGatilhoRef: (elemento: HTMLElement | null) => void }}
 */
function useLazyLoadGatilho({ temMais, quantidadeAtual, carregando, aoCarregarMais }) {
  const observerRef = useRef(null)

  // Espelhados em ref — o observer é criado uma vez por item-gatilho (via `useCallback` abaixo, sem
  // depender de `carregando`/`aoCarregarMais`) e precisa dos valores mais atuais sem precisar
  // recriar o observer toda vez que eles mudam.
  const carregandoRef = useRef(carregando)
  useEffect(() => {
    carregandoRef.current = carregando
  }, [carregando])

  const aoCarregarMaisRef = useRef(aoCarregarMais)
  useEffect(() => {
    aoCarregarMaisRef.current = aoCarregarMais
  })

  const onGatilhoRef = useCallback((elemento) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
    if (!elemento) return

    const raiz = elemento.closest('main')
    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting || carregandoRef.current) return
        aoCarregarMaisRef.current()
      },
      { root: raiz, rootMargin: '100px' },
    )
    observer.observe(elemento)
    observerRef.current = observer
  }, [])

  return {
    indiceGatilho: temMais ? quantidadeAtual - 2 : -1,
    onGatilhoRef,
  }
}

export { useLazyLoadGatilho }
