/**
 * Sessão mockada temporária — substituída pelo `AuthContext` real na Etapa 8.
 *
 * Editar os valores abaixo à mão é como testar os 3 cenários de guard nesta etapa:
 *   - `autenticado: false` → `RequireAuth` redireciona qualquer rota de leitor/admin pra `/login`.
 *   - `autenticado: true, papel: 'leitor'` → acessa rotas de leitor, mas `RequireRole` barra `/admin*`,
 *     redirecionando pra `/nao-autorizado`.
 *   - `autenticado: true, papel: 'administrador'` → acessa tudo.
 */
export const sessaoMock = {
  autenticado: false,
  papel: null,
}
