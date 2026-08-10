import { useCallback } from 'react'

import { metaDeLeituraService } from '../services/metaDeLeituraService'
import { useAsync } from './useAsync'

/**
 * Meta de Leitura do usuário num ano específico — `dado` vem `undefined` se ainda não existir
 * (não é erro, mesmo contrato de `usePerfil`/`useLivro`; `usuario-3` é o caso de borda já plantado
 * na fixture pra esse cenário, ver `metaDeLeituraService.js`). `ano` normalmente vem de
 * `useReadingStats().anoReferencia` — ver `MetaLeituraPage`.
 * @param {string} usuarioId
 * @param {number | null} ano
 */
function useMetaDeLeitura(usuarioId, ano) {
  const buscar = useCallback(() => {
    if (ano === null) {
      return Promise.resolve(undefined)
    }
    return metaDeLeituraService.buscarPorUsuarioEAno(usuarioId, ano)
  }, [usuarioId, ano])

  return useAsync(buscar)
}

export { useMetaDeLeitura }
