export const ROUTES = {
  AUTH: {
    BASE: 'auth',
    LOGIN: 'login', // POST /auth/login
    REGISTER: 'register', // POST /auth/register
    PROMOVER: 'promover', // POST /auth/promover
  },
  USUARIOS: {
    BASE: 'usuarios',
    // GET /usuarios, GET /usuarios/:id, PATCH /usuarios/:id, DELETE /usuarios/:id
  },
  CREDENCIADOS: {
    BASE: 'credenciados',
    CRIAR: '', // POST /credenciados
    BUSCAR_CPF: 'cpf/:cpf', // GET /credenciados/cpf/:cpf
    // GET /credenciados, GET /credenciados/:id, PATCH /credenciados/:id, DELETE /credenciados/:id
  },
  EVENTOS: {
    BASE: 'eventos',
    // GET /eventos, PATCH /eventos/:id
  },
  DESCARBONIZACAO: {
    BASE: 'descarbonizacao',
    SUMMARY: 'summary', // GET /descarbonizacao/summary
    BY_CREDENCIADO: ':credenciadoId', // GET /descarbonizacao/:credenciadoId
  },
  SCANS: {
    BASE: 'scans',
    CHECK_IN: 'check-in', // POST /scans/check-in
    CHECK_IN_BATCH: 'check-in-batch', // POST /scans/check-in-batch
    SUMMARY: 'summary', // GET /scans/summary
    // GET /scans
  },
  DATA: {
    BASE: 'data',
    EVENTOS: 'eventos',
    USUARIOS_ORGANIZACAO: 'usuarios-organizacao',
    CREDENCIADOS: 'credenciados',
    ENDERECOS: 'enderecos',
    ENDERECO_CACHE: 'endereco-cache',
    DESCARBONIZACAO: 'descarbonizacao',
    CREDENCIAL: 'credenciais',
    QR_SCANS: 'qr-scans',
  },
};
