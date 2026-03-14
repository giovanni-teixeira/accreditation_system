export const ROUTES = {
  AUTH: {
    BASE: 'auth',
    LOGIN: 'login', // POST /auth/login
    REGISTER: 'register', // POST /auth/register
  },
  CREDENCIADOS: {
    BASE: 'credenciados',
    CRIAR: '', // POST /credenciados
    BUSCAR_CPF: 'cpf/:cpf', // GET /credenciados/cpf/:cpf
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
