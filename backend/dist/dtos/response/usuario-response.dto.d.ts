import { PerfilAcesso } from '@prisma/client';
export declare class UsuarioResponseDto {
    id: string;
    login: string;
    perfilAcesso: PerfilAcesso;
    constructor(partial: any);
}
