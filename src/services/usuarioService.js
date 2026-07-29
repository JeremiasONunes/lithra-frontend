import { MockServiceError, delay, generateId, readCollection, writeCollection } from './mockStorage'

const COLECAO = 'usuarios'

/**
 * @typedef {Object} Usuario
 * @property {string} id
 * @property {string} nome
 * @property {string} email
 * @property {string} senha - mock apenas, texto puro; uma API real nunca guardaria assim (hash etc.)
 * @property {'leitor' | 'administrador'} papel
 * @property {string} [fotoUrl]
 * @property {string} [bio]
 * @property {'publica' | 'privada'} privacidadeEstante
 * @property {boolean} ativo - moderação (Etapa 19): `false` = conta desativada, nunca removida
 * @property {string} criadoEm - data ISO 8601
 */

/**
 * Fixture determinística. Casos de borda deliberados: `usuario-4` com estante privada,
 * `usuario-5` com conta desativada (login/seguir/estante precisam lidar com usuário inativo),
 * `usuario-6` administrador.
 * @type {Usuario[]}
 */
const usuariosFixture = [
  {
    id: 'usuario-1',
    nome: 'Mariana Silva',
    email: 'mariana@exemplo.com',
    senha: 'senha123',
    papel: 'leitor',
    bio: 'Lendo um livro de cada vez, café em mãos.',
    privacidadeEstante: 'publica',
    ativo: true,
    criadoEm: '2025-01-10T12:00:00.000Z',
  },
  {
    id: 'usuario-2',
    nome: 'Lucas Andrade',
    email: 'lucas@exemplo.com',
    senha: 'senha123',
    papel: 'leitor',
    bio: 'Ficção científica e fantasia, sempre.',
    privacidadeEstante: 'publica',
    ativo: true,
    criadoEm: '2025-01-12T09:30:00.000Z',
  },
  {
    id: 'usuario-3',
    nome: 'José Pereira',
    email: 'jose@exemplo.com',
    senha: 'senha123',
    papel: 'leitor',
    bio: 'Clássicos da literatura brasileira.',
    privacidadeEstante: 'publica',
    ativo: true,
    criadoEm: '2025-02-01T15:00:00.000Z',
  },
  {
    id: 'usuario-4',
    nome: 'Beatriz Nogueira',
    email: 'beatriz@exemplo.com',
    senha: 'senha123',
    papel: 'leitor',
    bio: 'Estante privada, leitura tranquila.',
    privacidadeEstante: 'privada',
    ativo: true,
    criadoEm: '2025-02-15T18:20:00.000Z',
  },
  {
    id: 'usuario-5',
    nome: 'Rafael Costa',
    email: 'rafael@exemplo.com',
    senha: 'senha123',
    papel: 'leitor',
    ativo: false,
    privacidadeEstante: 'publica',
    criadoEm: '2025-03-01T08:00:00.000Z',
  },
  {
    id: 'usuario-6',
    nome: 'Equipe Lythra',
    email: 'admin@lythra.com',
    senha: 'admin123',
    papel: 'administrador',
    privacidadeEstante: 'publica',
    ativo: true,
    criadoEm: '2025-01-01T00:00:00.000Z',
  },
]

function getAll() {
  return readCollection(COLECAO, usuariosFixture)
}

/** Aplica um patch parcial a um usuário existente e persiste. Uso interno — `atualizar` (público,
 * restrito aos campos editáveis) e `desativar` (público, só mexe em `ativo`) compõem sobre isto. */
function salvarPatch(id, patch) {
  const usuarios = getAll()
  const index = usuarios.findIndex((usuario) => usuario.id === id)

  if (index === -1) {
    throw new MockServiceError('Usuário não encontrado.')
  }

  const atualizado = { ...usuarios[index], ...patch }
  const proximos = [...usuarios]
  proximos[index] = atualizado
  writeCollection(COLECAO, proximos)
  return atualizado
}

async function listar() {
  await delay(300)
  return getAll()
}

async function buscarPorId(id) {
  await delay(200)
  return getAll().find((usuario) => usuario.id === id)
}

async function buscarPorEmail(email) {
  await delay(200)
  return getAll().find((usuario) => usuario.email.toLowerCase() === email.toLowerCase())
}

/** Login mockado: retorna o usuário se e-mail/senha conferem e a conta está ativa; `null` caso
 * contrário — nunca lança erro para credencial inválida, isso é fluxo esperado do chamador
 * (Etapa 9). */
async function verificarCredenciais(email, senha) {
  await delay(400)
  const usuario = getAll().find(
    (item) => item.email.toLowerCase() === email.toLowerCase() && item.senha === senha,
  )
  if (!usuario || !usuario.ativo) {
    return null
  }
  return usuario
}

async function criar(dados) {
  await delay(400)
  const usuarios = getAll()

  if (usuarios.some((usuario) => usuario.email.toLowerCase() === dados.email.toLowerCase())) {
    throw new MockServiceError('Já existe uma conta com este e-mail.')
  }

  const novoUsuario = {
    ...dados,
    id: generateId('usuario'),
    papel: 'leitor',
    privacidadeEstante: 'publica',
    ativo: true,
    criadoEm: new Date().toISOString(),
  }

  writeCollection(COLECAO, [...usuarios, novoUsuario])
  return novoUsuario
}

async function atualizar(id, dados) {
  await delay(300)
  return salvarPatch(id, dados)
}

/** Moderação/autoexclusão: desativa a conta, nunca remove o registro — avaliações e itens de
 * estante continuam referenciando um `usuarioId` válido. */
async function desativar(id) {
  await delay(300)
  return salvarPatch(id, { ativo: false })
}

const usuarioService = {
  listar,
  buscarPorId,
  buscarPorEmail,
  verificarCredenciais,
  criar,
  atualizar,
  desativar,
}

export { usuarioService }
