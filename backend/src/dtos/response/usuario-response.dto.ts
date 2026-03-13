import { PerfilAcesso } from '@prisma/client';
import { IUsuarioOrganizacao } from '../../interfaces';

export class UsuarioResponseDto {
  id: string;
  login: string;
  perfilAcesso: PerfilAcesso;

  constructor(partial: IUsuarioOrganizacao) {
    this.id = partial.id;
    this.login = partial.login;
    this.perfilAcesso = partial.perfilAcesso as PerfilAcesso;
    // Note: senhaHash is explicitly NOT included
  }
}
