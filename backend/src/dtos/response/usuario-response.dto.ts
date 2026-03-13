// src/dtos/response/usuario-response.dto.ts
import { PerfilAcesso } from '@prisma/client';

export class UsuarioResponseDto {
  id: string;
  login: string;
  perfilAcesso: PerfilAcesso;

  constructor(partial: any) {
    this.id = partial.id;
    this.login = partial.login;
    this.perfilAcesso = partial.perfilAcesso;
    // Note: senhaHash is explicitly NOT included
  }
}
