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
};
