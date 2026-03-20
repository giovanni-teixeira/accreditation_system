import { ENV_CONFIG, STORAGE_KEYS, API_ROUTES } from './api-config'

export enum TipoCategoria {
  EXPOSITOR = 'EXPOSITOR',
  VISITANTE = 'VISITANTE',
  PRODUTOR = 'PRODUTOR',
  IMPRENSA = 'IMPRENSA',
  ORGANIZACAO = 'ORGANIZACAO',
  TERCEIRIZADO = 'TERCEIRIZADO',
}

export enum TipoCombustivel {
  GASOLINA = 'GASOLINA',
  ETANOL = 'ETANOL',
  DIESEL = 'DIESEL',
  ELETRICO = 'ELETRICO',
}

export enum PerfilAcesso {
  ADMIN = 'ADMIN',
  LEITOR_CATRACA = 'LEITOR_CATRACA',
}

const API_URL = (ENV_CONFIG.API_BASE_URL || '') + '/api'

// =============================================================================
// HELPERS
// =============================================================================

function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  const jwt = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.TOKEN) : null
  if (jwt) headers['Authorization'] = `Bearer ${jwt}`
  return headers
}

async function request<T>(
  path: string,
  options: RequestInit & { revalidate?: number } = {},
): Promise<T> {
  const { revalidate, ...fetchOptions } = options

  const res = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers: {
      ...getAuthHeaders(),
      ...(fetchOptions.headers ?? {}),
    },
    next: revalidate !== undefined ? { revalidate } : undefined,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message ?? `Erro ${res.status}`)
  }

  if (res.status === 204) return undefined as T

  return res.json()
}

// =============================================================================
// INTERFACES DE RETORNO
// =============================================================================

// --- Usuário ---
export interface IUsuario {
  id: string
  login: string
  perfilAcesso: PerfilAcesso
  setor?: string
  createdAt: string
  updatedAt: string
}

// --- Auth ---
// O login retorna token + publicKey (para LEITOR_CATRACA) + dados do usuário
export interface ILoginResponse {
  access_token: string
  publicKey: string | null
  user: IUsuario
}

// O promover retorna IUsuario + credenciado vinculado + mensagem
export interface IPromoverResponse extends IUsuario {
  credenciado: {
    id: string
    nomeCompleto: string
    cpf: string
    tipoCategoria: TipoCategoria
  }
  mensagem: string
}

// --- Evento ---
export interface IEvento {
  id: string
  nomeEvento: string
  isGratuito: boolean
  localEvento?: string
  latitude?: number
  longitude?: number
  createdAt: string
  updatedAt: string
}

// --- Endereço ---
export interface IEndereco {
  cep?: string
  rua?: string
  bairro?: string
  cidade: string
  estado: string
  pais: string
  latitude?: number
  longitude?: number
}

// --- Descarbonização ---
export interface IDescarbonizacao {
  id: string
  credenciadoId: string
  distanciaIdaVoltaKm: number
  tipoCombustivel: TipoCombustivel
  latitudeOrigem?: number
  longitudeOrigem?: number
  pegadaCo2?: number
  createdAt: string
  updatedAt: string
  credenciado?: {
    nomeCompleto: string
    cpf?: string
    tipoCategoria?: string
  }
}

export interface IDescarbonizacaoSummary {
  totalCo2Kg: number
  totalDistanciaKm: number
  totalCredenciados: number
}

// --- Credencial ---
export interface ICredencial {
  id: string
  credenciadoId: string
  ticketId: string
  qrToken: string
  status: string
  downloads: number
  printCount: number
  createdAt: string
  updatedAt: string
}

// --- Credenciado ---
export interface ICredenciado {
  id: string
  eventoId: string
  tipoCategoria: TipoCategoria
  nomeCompleto: string
  cpf: string
  rg?: string
  celular: string
  email: string
  cnpj?: string
  ccir?: string
  nomeEmpresa?: string
  siteEmpresa?: string
  nomePropriedade?: string
  nomeVeiculo?: string
  aceiteLgpd: boolean
  createdAt: string
  updatedAt: string
  credencial?: ICredencial
  endereco?: IEndereco
  descarbonizacao?: IDescarbonizacao
}

// --- Scans ---
export interface ICheckInResult {
  ticketId: string
  status: string
  nomeCompleto: string
  tipoCategoria: TipoCategoria
}

export interface ICheckInBatchResult {
  results: Array<{
    ticketId: string
    success: boolean
    message?: string
  }>
}

// --- QR Scan ---
export interface IQrScan {
  id: string
  ticketId: string
  scannerId: string
  scanType: string
  createdAt: string
}

export interface IScannerActivity {
  scannerId: string
  scannerName: string
  setor: string
  totalScans: number
  lastScanAt: string
}

export interface IScanLog {
  id: string
  ticketId: string
  scanType: string
  createdAt: string
  scannerName: string
  credenciadoNome: string
  credenciadoCpf: string
  tipoCategoria: string
}

// --- Dashboard ---
export interface IDashboardKPIs {
  totalCredenciados: number
  expositores: number
  produtores: number
  visitantes: number
  imprensa: number
  organizacao: number
  terceirizado: number
}

export interface IDashboardResponse {
  kpis: IDashboardKPIs
  recentRegistrations: Array<{
    id: string
    nomeCompleto: string
    tipoCategoria: TipoCategoria
    email: string
    createdAt: string
    credencial: { status: string } | null
  }>
  categoryChart: Array<{
    categoria: TipoCategoria
    total: number
  }>
}

// =============================================================================
// DTOs DE ENTRADA
// =============================================================================

export interface ICadastrarCredenciadoDTO {
  // Obrigatórios
  nomeCompleto: string
  cpf: string
  celular: string
  email: string
  cidade: string
  estado: string
  aceiteLgpd: boolean
  tipoCategoria: TipoCategoria
  tipoCombustivel: TipoCombustivel
  // Endereço opcional
  pais?: string
  cep?: string
  rua?: string
  bairro?: string
  // Distância manual (ignora cálculo automático por CEP)
  distanciaManualKm?: number
  // Campos opcionais por categoria
  rg?: string
  cnpj?: string
  ccir?: string
  nomeEmpresa?: string
  siteEmpresa?: string
  nomePropriedade?: string
  nomeVeiculo?: string
}

export interface IRegistrarUsuarioDTO {
  login: string
  senhaPura: string
  perfilAcesso: PerfilAcesso
  setor?: string
  // Opcionais: se informados, cria também credenciado + credencial
  cpf?: string
  nomeCompleto?: string
  celular?: string
  email?: string
  rg?: string
}

export interface IPromoverCredenciadoDTO {
  cpf: string
  login: string
  senhaPura: string
  perfilAcesso: PerfilAcesso
  setor?: string
}

// =============================================================================
// SERVICES
// =============================================================================

export const authService = {
  /** POST /auth/login — público */
  login(login: string, senhaHash: string): Promise<ILoginResponse> {
    return request<ILoginResponse>(API_ROUTES.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ login, senhaHash }),
    })
  },

  /**
   * POST /auth/register — requer ADMIN
   * Cria usuário de organização. Se cpf for informado,
   * também cria credenciado + credencial (QR) automaticamente.
   */
  register(data: IRegistrarUsuarioDTO): Promise<IUsuario> {
    return request<IUsuario>(API_ROUTES.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * POST /auth/promover — requer ADMIN
   * Busca credenciado existente pelo CPF e cria login de acesso.
   * Retorna usuário criado + credenciado vinculado + mensagem.
   */
  promover(data: IPromoverCredenciadoDTO): Promise<IPromoverResponse> {
    return request<IPromoverResponse>(API_ROUTES.AUTH.PROMOVER, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

// =============================================================================
// USUÁRIOS
// GET /usuarios | GET /usuarios/:id | PATCH /usuarios/:id | DELETE /usuarios/:id
// Todas requerem ADMIN
// =============================================================================

export const usuariosService = {
  /** GET /usuarios */
  listar(): Promise<IUsuario[]> {
    return request<IUsuario[]>('/usuarios', { revalidate: 0 })
  },

  /** GET /usuarios/:id */
  buscarPorId(id: string): Promise<IUsuario> {
    return request<IUsuario>(`/usuarios/${id}`)
  },

  /**
   * PATCH /usuarios/:id
   * Aceita perfilAcesso, setor e senhaPura (o backend faz o hash internamente)
   */
  atualizar(
    id: string,
    data: { perfilAcesso?: PerfilAcesso; setor?: string; senhaPura?: string },
  ): Promise<IUsuario> {
    return request<IUsuario>(`/usuarios/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  /** DELETE /usuarios/:id */
  deletar(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/usuarios/${id}`, { method: 'DELETE' })
  },
}

// =============================================================================
// CREDENCIADOS
// POST /credenciados — público
// GET /credenciados — ADMIN
// GET /credenciados/cpf/:cpf — público
// GET /credenciados/:id — ADMIN
// PATCH /credenciados/:id — ADMIN
// DELETE /credenciados/:id — ADMIN
// =============================================================================

export const credenciadosService = {
  /**
   * POST /credenciados — público
   * Cria credenciado + endereço + descarbonização + credencial (QR) em uma única chamada
   */
  cadastrar(data: ICadastrarCredenciadoDTO): Promise<ICredenciado> {
    return request<ICredenciado>(API_ROUTES.CREDENCIADOS.LISTAR, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /** GET /credenciados — requer ADMIN, retorna lista com credencial e endereço */
  listar(): Promise<ICredenciado[]> {
    return request<ICredenciado[]>(API_ROUTES.CREDENCIADOS.LISTAR, { revalidate: 0 })
  },

  /** GET /credenciados/cpf/:cpf — público */
  buscarPorCpf(cpf: string): Promise<ICredenciado> {
    return request<ICredenciado>(API_ROUTES.CREDENCIADOS.BUSCAR_CPF(cpf))
  },

  /** GET /credenciados/:id — requer ADMIN, retorna com credencial e endereço */
  buscarPorId(id: string): Promise<ICredenciado> {
    return request<ICredenciado>(API_ROUTES.CREDENCIADOS.BUSCAR(id))
  },

  /** PATCH /credenciados/:id — requer ADMIN */
  atualizar(id: string, data: Partial<ICadastrarCredenciadoDTO>): Promise<ICredenciado> {
    return request<ICredenciado>(API_ROUTES.CREDENCIADOS.BUSCAR(id), {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  /** DELETE /credenciados/:id — requer ADMIN */
  deletar(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(API_ROUTES.CREDENCIADOS.BUSCAR(id), { method: 'DELETE' })
  },
}

// =============================================================================
// EVENTOS
// GET /eventos — público, retorna objeto único (não array!)
// PATCH /eventos/:id — requer ADMIN
// =============================================================================

export const eventosService = {
  /** GET /eventos — retorna o único evento do sistema */
  ver(): Promise<IEvento> {
    return request<IEvento>('/eventos', { revalidate: 60 })
  },

  /** PATCH /eventos/:id — requer ADMIN */
  atualizar(
    id: string,
    data: Partial<Pick<IEvento, 'nomeEvento' | 'localEvento' | 'latitude' | 'longitude'>>,
  ): Promise<IEvento> {
    return request<IEvento>(`/eventos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },
}

// =============================================================================
// DESCARBONIZAÇÃO
// Todas requerem ADMIN
// GET /descarbonizacao
// GET /descarbonizacao/summary
// GET /descarbonizacao/:credenciadoId
// =============================================================================

export const descarbonizacaoService = {
  /** GET /descarbonizacao — lista todos com dados do credenciado */
  listar(): Promise<IDescarbonizacao[]> {
    return request<IDescarbonizacao[]>('/descarbonizacao', { revalidate: 0 })
  },

  /** GET /descarbonizacao/summary — total de CO2 e distância de todos */
  summary(): Promise<IDescarbonizacaoSummary> {
    return request<IDescarbonizacaoSummary>('/descarbonizacao/summary', {
      revalidate: 30,
    })
  },

  /** GET /descarbonizacao/:credenciadoId */
  buscarPorCredenciado(credenciadoId: string): Promise<IDescarbonizacao> {
    return request<IDescarbonizacao>(`/descarbonizacao/${credenciadoId}`)
  },
}

// =============================================================================
// SCANS (CHECK-IN)
// Requerem ADMIN ou LEITOR_CATRACA
// POST /scans/check-in
// POST /scans/check-in-batch
// =============================================================================

export const scansService = {
  /** POST /scans/check-in — check-in individual com unicidade diária */
  checkIn(ticketId: string): Promise<ICheckInResult> {
    return request<ICheckInResult>('/scans/check-in', {
      method: 'POST',
      body: JSON.stringify({ ticketId }),
    })
  },

  /** POST /scans/check-in-batch — sincronização em lote */
  checkInBatch(ticketIds: string[]): Promise<ICheckInBatchResult> {
    return request<ICheckInBatchResult>('/scans/check-in-batch', {
      method: 'POST',
      body: JSON.stringify({ ticketIds }),
    })
  },

  /** GET /scans/activities — obter estatísticas por scanner (Admin only) */
  /** GET /scans/activities — obter estatísticas por scanner (Admin only) */
  listarAtividades(): Promise<IScannerActivity[]> {
    return request<IScannerActivity[]>('/scans/activities', { revalidate: 0 })
  },

  /** GET /scans/logs — obter histórico detalhado de capturas (Admin only) */
  listarLogs(filtros: { 
    scannerId?: string; 
    ticketId?: string; 
    nome?: string; 
    startDate?: string;
    endDate?: string;
    limit?: number 
  }): Promise<IScanLog[]> {
    const params = new URLSearchParams()
    if (filtros.scannerId) params.append('scannerId', filtros.scannerId)
    if (filtros.ticketId) params.append('ticketId', filtros.ticketId)
    if (filtros.nome) params.append('nome', filtros.nome)
    if (filtros.startDate) params.append('startDate', filtros.startDate)
    if (filtros.endDate) params.append('endDate', filtros.endDate)
    if (filtros.limit) params.append('limit', filtros.limit.toString())
    
    return request<IScanLog[]>(`/scans/logs?${params.toString()}`, { revalidate: 0 })
  },

  /** GET /scans/dates — obter lista de datas únicas com scans (Admin only) */
  listarDatasDisponiveis(): Promise<string[]> {
    return request<string[]>('/scans/dates', { revalidate: 0 })
  },
}

// =============================================================================
// ENDEREÇOS
// GET /address/:zipCode?country= — público
// GET /endereco-cache — requer ADMIN
// =============================================================================

export const enderecoService = {
  /** GET /address/:cep?country=Brasil */
  buscarPorCep(cep: string): Promise<IEndereco> {
    return request<IEndereco>(API_ROUTES.ENDERECO.BUSCAR_CEP(cep))
  },

  /** GET /endereco-cache — requer ADMIN */
  listarCache(): Promise<IEndereco[]> {
    return request<IEndereco[]>(API_ROUTES.ENDERECO.CACHE, { revalidate: 300 })
  },
}

// =============================================================================
// DASHBOARD
// Endpoint customizado no backend — ver dashboard.service.ts
// GET /dashboard/kpis?eventoId= — requer ADMIN
// =============================================================================

export const dashboardService = {
  getKPIs(eventoId?: string): Promise<IDashboardResponse> {
    const query = eventoId ? `?eventoId=${eventoId}` : ''
    return request<IDashboardResponse>(`${API_ROUTES.DASHBOARD.KPI}${query}`, {
      revalidate: 60,
    })
  },
}