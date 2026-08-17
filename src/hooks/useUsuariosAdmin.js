import { useCallback } from 'react'

import { usuarioService } from '../services/usuarioService'
import { useAsync } from './useAsync'

/**
 * Lista todos os usuários (inclusive contas desativadas — `UserManagementTable` precisa mostrar o
 * status de cada um) pra Gestão de Usuários (#23, Etapa 19). Hook próprio dedicado ao admin, mesmo
 * raciocínio de `useCatalogoAdmin`: o roadmap nomeia `useUsuariosAdmin` explicitamente, então não
 * reaproveita `useUsuarios` (Etapa 12) por trás de um nome que esconderia o propósito.
 */
function useUsuariosAdmin() {
  const buscar = useCallback(() => usuarioService.listar(), [])
  return useAsync(buscar)
}

export { useUsuariosAdmin }
