// Enums
export type CategoriaCredenciado = 'EXPOSITOR' | 'CAFEICULTOR' | 'VISITANTE' | 'IMPRENSA'

// Removido status - credenciados são apenas confirmados ou não existem
export type PerfilAcesso = 'ADMIN' | 'COMISSAO_ORGANIZADORA' | 'COLABORADOR_TERCEIRIZADO'

// Interfaces
export interface Evento {
  id: string
  nomeEvento: string
  isGratuito: boolean
  dataInicio: string
  dataFim: string
  local: string
  ativo: boolean
}

export interface Credenciado {
  id: string
  eventoId: string
  tipoCategoria: CategoriaCredenciado
  nomeCompleto: string
  cpf: string
  rg?: string
  celular: string
  email: string
  rua?: string
  municipio: string
  uf: string
  cnpj?: string // Para expositor/imprensa
  ccir?: string // Para cafeicultor
  empresa?: string
  cargo?: string
  aceiteLgpd: boolean
  createdAt: string
  updatedAt?: string
  // Dados para cálculo de carbono
  cidadeOrigem?: string
  estadoOrigem?: string
  distanciaKm?: number
  meioTransporte?: 'CARRO' | 'ONIBUS' | 'AVIAO' | 'MOTO'
}

export interface UsuarioAdmin {
  id: string
  nome: string
  login: string
  senha: string
  email: string
  perfilAcesso: PerfilAcesso
  avatar?: string
  ativo: boolean
}

export interface HistoricoCredenciado {
  id: string
  credenciadoId: string
  acao: string
  descricao: string
  dataHora: string
  usuario?: string
}

// KPIs
export interface DashboardKPIs {
  totalCredenciados: number
  expositores: number
  cafeicultores: number
  visitantes: number
  imprensa: number
}

// Filtros
export interface FiltrosCredenciados {
  busca?: string
  categoria?: CategoriaCredenciado | ''
  uf?: string
  eventoId?: string
}

// Paginação
export interface Paginacao {
  pagina: number
  porPagina: number
  total: number
  totalPaginas: number
}

// Configurações do Evento
export interface ConfiguracoesEvento {
  id: string
  eventoId: string
  permitirAutoCredenciamento: boolean
  enviarEmailConfirmacao: boolean
  limitePorCategoria: Record<CategoriaCredenciado, number>
  camposObrigatorios: string[]
}

// Para cálculo de carbono
export interface EmissaoCarbono {
  credenciadoId: string
  distanciaKm: number
  meioTransporte: 'CARRO' | 'ONIBUS' | 'AVIAO' | 'MOTO'
  emissaoKgCO2: number
}
