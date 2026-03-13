import { PerfilAcesso } from '@prisma/client';
export declare class RegisterDto {
    login: string;
    senhaPura: string;
    perfilAcesso: PerfilAcesso;
}
