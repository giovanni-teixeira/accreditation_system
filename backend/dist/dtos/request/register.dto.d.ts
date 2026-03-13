import { PerfilAcesso } from '@prisma/client';
export declare class RegisterDto {
    login: string;
    senhaPura: string;
    perfilAcesso: PerfilAcesso;
    nomeCompleto?: string;
    cpf?: string;
    rg?: string;
    celular?: string;
    email?: string;
    setor?: string;
}
