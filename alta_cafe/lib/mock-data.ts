import type {
  Evento,
  Credenciado,
  UsuarioAdmin,
  HistoricoCredenciado,
  DashboardKPIs
} from './types'

// Evento único - Alta Café 2026
export const evento: Evento = {
  id: 'evt-001',
  nomeEvento: 'Alta Café 2026',
  isGratuito: false,
  dataInicio: '2026-06-15',
  dataFim: '2026-06-18',
  local: 'Clube de Campo da Franca',
  ativo: true,
}

// Usuário Admin único
export const usuarioAdmin: UsuarioAdmin = {
  id: 'usr-001',
  nome: 'Administrador',
  login: 'admin',
  senha: 'admin123',
  email: 'admin@altacafe.com.br',
  perfilAcesso: 'ADMIN',
  avatar: undefined,
  ativo: true,
}

// Credenciados
export const credenciados: Credenciado[] = [
  {
    id: 'cred-001',
    eventoId: 'evt-001',
    tipoCategoria: 'EXPOSITOR',
    nomeCompleto: 'João Pedro Machado',
    cpf: '123.456.789-00',
    rg: 'MG-12.345.678',
    celular: '(34) 99999-1234',
    email: 'joao.machado@cafeselecionados.com.br',
    rua: 'Av. Brasil, 1500',
    municipio: 'Patrocínio',
    uf: 'MG',
    cnpj: '12.345.678/0001-90',
    empresa: 'Cafés Selecionados Ltda',
    cargo: 'Diretor Comercial',
    aceiteLgpd: true,
    createdAt: '2026-03-01T10:30:00Z',
    cidadeOrigem: 'Patrocínio',
    estadoOrigem: 'MG',
    distanciaKm: 0,
    meioTransporte: 'CARRO',
  },
  {
    id: 'cred-002',
    eventoId: 'evt-001',
    tipoCategoria: 'PRODUTOR',
    nomeCompleto: 'Ana Carolina Ferreira',
    cpf: '987.654.321-00',
    rg: 'MG-98.765.432',
    celular: '(34) 98888-5678',
    email: 'ana.ferreira@fazendaboavista.com',
    rua: 'Fazenda Boa Vista, S/N',
    municipio: 'Araguari',
    uf: 'MG',
    ccir: '123456789012',
    empresa: 'Fazenda Boa Vista',
    aceiteLgpd: true,
    createdAt: '2026-03-02T14:15:00Z',
    cidadeOrigem: 'Araguari',
    estadoOrigem: 'MG',
    distanciaKm: 85,
    meioTransporte: 'CARRO',
  },
  {
    id: 'cred-003',
    eventoId: 'evt-001',
    tipoCategoria: 'VISITANTE',
    nomeCompleto: 'Carlos Eduardo Santos',
    cpf: '456.789.123-00',
    celular: '(11) 97777-9012',
    email: 'carlos.santos@gmail.com',
    municipio: 'São Paulo',
    uf: 'SP',
    aceiteLgpd: true,
    createdAt: '2026-03-03T09:45:00Z',
    cidadeOrigem: 'São Paulo',
    estadoOrigem: 'SP',
    distanciaKm: 580,
    meioTransporte: 'AVIAO',
  },
  {
    id: 'cred-004',
    eventoId: 'evt-001',
    tipoCategoria: 'IMPRENSA',
    nomeCompleto: 'Fernanda Lima Costa',
    cpf: '321.654.987-00',
    rg: 'SP-32.165.498',
    celular: '(11) 96666-3456',
    email: 'fernanda.costa@revistarural.com.br',
    municipio: 'Campinas',
    uf: 'SP',
    cnpj: '98.765.432/0001-10',
    empresa: 'Revista Rural Brasil',
    cargo: 'Jornalista',
    aceiteLgpd: true,
    createdAt: '2026-03-04T16:20:00Z',
    cidadeOrigem: 'Campinas',
    estadoOrigem: 'SP',
    distanciaKm: 520,
    meioTransporte: 'CARRO',
  },
  {
    id: 'cred-005',
    eventoId: 'evt-001',
    tipoCategoria: 'EXPOSITOR',
    nomeCompleto: 'Roberto Almeida Neto',
    cpf: '654.321.987-00',
    rg: 'MG-65.432.198',
    celular: '(34) 95555-7890',
    email: 'roberto@maquinasagricolas.com.br',
    rua: 'Rod. BR-365, Km 45',
    municipio: 'Uberlândia',
    uf: 'MG',
    cnpj: '45.678.901/0001-23',
    empresa: 'Máquinas Agrícolas Sul',
    cargo: 'Gerente de Vendas',
    aceiteLgpd: true,
    createdAt: '2026-03-05T11:00:00Z',
    cidadeOrigem: 'Uberlândia',
    estadoOrigem: 'MG',
    distanciaKm: 145,
    meioTransporte: 'CARRO',
  },
  {
    id: 'cred-006',
    eventoId: 'evt-001',
    tipoCategoria: 'PRODUTOR',
    nomeCompleto: 'Mariana Oliveira Prado',
    cpf: '789.123.456-00',
    celular: '(35) 94444-2345',
    email: 'mariana@sitioespresso.com',
    municipio: 'Carmo do Paranaíba',
    uf: 'MG',
    ccir: '987654321098',
    empresa: 'Sítio Espresso',
    aceiteLgpd: true,
    createdAt: '2026-03-05T15:30:00Z',
    cidadeOrigem: 'Carmo do Paranaíba',
    estadoOrigem: 'MG',
    distanciaKm: 62,
    meioTransporte: 'CARRO',
  },
  {
    id: 'cred-007',
    eventoId: 'evt-001',
    tipoCategoria: 'VISITANTE',
    nomeCompleto: 'Lucas Henrique Martins',
    cpf: '147.258.369-00',
    celular: '(31) 93333-6789',
    email: 'lucas.martins@outlook.com',
    municipio: 'Belo Horizonte',
    uf: 'MG',
    aceiteLgpd: true,
    createdAt: '2026-03-06T08:15:00Z',
    cidadeOrigem: 'Belo Horizonte',
    estadoOrigem: 'MG',
    distanciaKm: 420,
    meioTransporte: 'ONIBUS',
  },
  {
    id: 'cred-008',
    eventoId: 'evt-001',
    tipoCategoria: 'EXPOSITOR',
    nomeCompleto: 'Patricia Souza Lima',
    cpf: '369.258.147-00',
    rg: 'SP-36.925.814',
    celular: '(19) 92222-0123',
    email: 'patricia@fertilizantesagro.com.br',
    rua: 'Av. das Indústrias, 800',
    municipio: 'Ribeirão Preto',
    uf: 'SP',
    cnpj: '67.890.123/0001-45',
    empresa: 'Fertilizantes Agro Brasil',
    cargo: 'Diretora Comercial',
    aceiteLgpd: true,
    createdAt: '2026-03-06T10:45:00Z',
    cidadeOrigem: 'Ribeirão Preto',
    estadoOrigem: 'SP',
    distanciaKm: 340,
    meioTransporte: 'CARRO',
  },
  {
    id: 'cred-009',
    eventoId: 'evt-001',
    tipoCategoria: 'PRODUTOR',
    nomeCompleto: 'Antônio José Ribeiro',
    cpf: '258.147.369-00',
    celular: '(34) 91111-4567',
    email: 'antonio.ribeiro@hotmail.com',
    municipio: 'Monte Carmelo',
    uf: 'MG',
    ccir: '456789123456',
    aceiteLgpd: true,
    createdAt: '2026-03-06T14:00:00Z',
    cidadeOrigem: 'Monte Carmelo',
    estadoOrigem: 'MG',
    distanciaKm: 78,
    meioTransporte: 'MOTO',
  },
  {
    id: 'cred-010',
    eventoId: 'evt-001',
    tipoCategoria: 'IMPRENSA',
    nomeCompleto: 'Gustavo Henrique Dias',
    cpf: '741.852.963-00',
    celular: '(11) 90000-8901',
    email: 'gustavo.dias@agronoticias.com.br',
    municipio: 'São Paulo',
    uf: 'SP',
    cnpj: '11.222.333/0001-44',
    empresa: 'Portal Agro Notícias',
    cargo: 'Editor',
    aceiteLgpd: true,
    createdAt: '2026-03-07T09:30:00Z',
    cidadeOrigem: 'São Paulo',
    estadoOrigem: 'SP',
    distanciaKm: 580,
    meioTransporte: 'AVIAO',
  },
]

// Histórico de exemplo
export const historicoCredenciado: HistoricoCredenciado[] = [
  {
    id: 'hist-001',
    credenciadoId: 'cred-001',
    acao: 'CADASTRO',
    descricao: 'Credenciado cadastrado no sistema',
    dataHora: '2026-03-01T10:30:00Z',
    usuario: 'Sistema (auto-cadastro)',
  },
  {
    id: 'hist-002',
    credenciadoId: 'cred-001',
    acao: 'EDICAO',
    descricao: 'Dados atualizados pelo administrador',
    dataHora: '2026-03-01T14:00:00Z',
    usuario: 'admin',
  },
]

// KPIs do Dashboard
export const dashboardKPIs: DashboardKPIs = {
  totalCredenciados: 847,
  expositores: 156,
  produtores: 312,
  visitantes: 324,
  imprensa: 55,
}

// UFs disponíveis
export const ufs = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

// Labels das categorias
export const categoriasLabels: Record<string, string> = {
  EXPOSITOR: 'Expositor',
  PRODUTOR: 'Produtor',
  VISITANTE: 'Visitante',
  IMPRENSA: 'Imprensa',
  ORGANIZACAO: 'Organização',
  TERCEIRIZADO: 'Terceirizado',
}

// Cores das categorias
export const categoriaColors: Record<string, { bg: string; text: string; hex: string }> = {
  EXPOSITOR: { bg: 'bg-blue-100', text: 'text-blue-800', hex: '#0000FF' },
  PRODUTOR: { bg: 'bg-green-100', text: 'text-green-800', hex: '#00FF00' },
  VISITANTE: { bg: 'bg-purple-100', text: 'text-purple-800', hex: '#8B008B' },
  IMPRENSA: { bg: 'bg-slate-100', text: 'text-slate-800', hex: '#778899' },
  ORGANIZACAO: { bg: 'bg-orange-100', text: 'text-orange-800', hex: '#FF8C00' },
  TERCEIRIZADO: { bg: 'bg-red-100', text: 'text-red-800', hex: '#DC143C' },
}

// Dados de cidades para relatórios
export const cidadesData = [
  { cidade: 'Patrocínio/MG', credenciados: 156 },
  { cidade: 'Araguari/MG', credenciados: 98 },
  { cidade: 'Uberlândia/MG', credenciados: 87 },
  { cidade: 'São Paulo/SP', credenciados: 72 },
  { cidade: 'Belo Horizonte/MG', credenciados: 64 },
  { cidade: 'Ribeirão Preto/SP', credenciados: 51 },
  { cidade: 'Campinas/SP', credenciados: 43 },
  { cidade: 'Monte Carmelo/MG', credenciados: 38 },
]

// Dados diários para relatórios
export const diarioData = [
  { dia: '01/03', credenciados: 45 },
  { dia: '02/03', credenciados: 78 },
  { dia: '03/03', credenciados: 62 },
  { dia: '04/03', credenciados: 89 },
  { dia: '05/03', credenciados: 112 },
  { dia: '06/03', credenciados: 95 },
  { dia: '07/03', credenciados: 134 },
]

// Fatores de emissão de CO2 (kg CO2 por km por passageiro)
export const fatoresEmissao = {
  CARRO: 0.21, // kg CO2/km (média)
  ONIBUS: 0.089, // kg CO2/km por passageiro
  AVIAO: 0.255, // kg CO2/km por passageiro (voo doméstico)
  MOTO: 0.103, // kg CO2/km
}

// Função para calcular emissão de carbono
export function calcularEmissaoCO2(distanciaKm: number, meioTransporte: keyof typeof fatoresEmissao): number {
  return distanciaKm * fatoresEmissao[meioTransporte]
}

// Calcular emissão total de todos os credenciados
export function calcularEmissaoTotal(): {
  totalKgCO2: number
  porTransporte: Record<string, { quantidade: number; emissaoKg: number }>
  porCredenciado: Array<{ nome: string; cidade: string; distancia: number; transporte: string; emissaoKg: number }>
} {
  const porTransporte: Record<string, { quantidade: number; emissaoKg: number }> = {
    CARRO: { quantidade: 0, emissaoKg: 0 },
    ONIBUS: { quantidade: 0, emissaoKg: 0 },
    AVIAO: { quantidade: 0, emissaoKg: 0 },
    MOTO: { quantidade: 0, emissaoKg: 0 },
  }

  const porCredenciado: Array<{ nome: string; cidade: string; distancia: number; transporte: string; emissaoKg: number }> = []
  let totalKgCO2 = 0

  credenciados.forEach((c) => {
    if (c.distanciaKm && c.meioTransporte) {
      const emissao = calcularEmissaoCO2(c.distanciaKm, c.meioTransporte)
      totalKgCO2 += emissao
      porTransporte[c.meioTransporte].quantidade++
      porTransporte[c.meioTransporte].emissaoKg += emissao
      porCredenciado.push({
        nome: c.nomeCompleto,
        cidade: `${c.cidadeOrigem}/${c.estadoOrigem}`,
        distancia: c.distanciaKm,
        transporte: c.meioTransporte,
        emissaoKg: emissao,
      })
    }
  })

  return { totalKgCO2, porTransporte, porCredenciado }
}
