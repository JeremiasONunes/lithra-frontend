/**
 * Persistência da sessão — separado de `AuthContext.jsx` só porque exportar uma constante junto de
 * um componente no mesmo arquivo dispara `react-refresh/only-export-components` (mesma razão da
 * separação `routeConfig.jsx`/`AppRoutes.jsx` na Etapa 5). `CHAVE_SESSAO` também é usada pelos
 * testes, pra semear uma sessão sem duplicar a string em outro lugar.
 *
 * Guarda só o `id` do usuário logado (não o objeto inteiro), pra sempre reler o dado fresco de
 * `usuarioService` na hidratação em vez de confiar num usuário potencialmente desatualizado (ex.:
 * conta desativada por um admin desde a última visita).
 */
const CHAVE_SESSAO = 'lythra:sessao'

function lerUsuarioIdPersistido() {
  return localStorage.getItem(CHAVE_SESSAO)
}

function persistirUsuarioId(usuarioId) {
  if (usuarioId) {
    localStorage.setItem(CHAVE_SESSAO, usuarioId)
  } else {
    localStorage.removeItem(CHAVE_SESSAO)
  }
}

export { CHAVE_SESSAO, lerUsuarioIdPersistido, persistirUsuarioId }
