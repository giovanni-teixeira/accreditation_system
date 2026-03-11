import { TipoCombustivel } from '@prisma/client';
export declare class CredenciadoBaseDto {
    nomeCompleto: string;
    cpf: string;
    rg: string;
    celular: string;
    email: string;
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    aceiteLgpd: boolean;
    tipoCombustivel: TipoCombustivel;
}
