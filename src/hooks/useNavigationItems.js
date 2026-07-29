import { NAVEGACAO_POR_PAPEL } from './navigationConfig'

/**
 * Deriva a lista de itens de navegação a partir do papel do usuário logado. Não é um hook de
 * leitura assíncrona (não usa `useAsync`) — é derivação síncrona pura de configuração estática, sem
 * `carregando`/`erro` fazendo sentido aqui.
 * @param {'leitor' | 'administrador' | null} papel
 * @returns {{ rota: string, rotulo: string, icon: import('react').ComponentType }[]}
 */
function useNavigationItems(papel) {
  return NAVEGACAO_POR_PAPEL[papel] ?? []
}

export { useNavigationItems }
