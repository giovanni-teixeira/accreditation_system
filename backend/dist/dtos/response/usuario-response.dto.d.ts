import { PerfilAcesso } from '@prisma/client';
import { IUsuarioOrganizacao } from '../../interfaces';
export declare class UsuarioResponseDto {
    id: string;
    login: string;
    perfilAcesso: PerfilAcesso;
    constructor(partial: IUsuarioOrganizacao);
}
