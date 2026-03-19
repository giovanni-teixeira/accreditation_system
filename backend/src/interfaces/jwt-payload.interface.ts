export interface JwtPayload {
  sub: string; // ID do usuário (userId)
  login: string; // Login do usuário
  role: string; // Papel: 'ADMIN' | 'LEITOR_CATRACA'
}
