import { TipoCategoria, TipoCombustivel } from '@prisma/client';
export declare class CredenciadoResponseDto {
    id: string;
    nomeCompleto: string;
    cpf: string;
    email: string;
    tipoCategoria: TipoCategoria;
    tipoCombustivel?: TipoCombustivel;
    endereco?: any;
    credencial?: any;
    descarbonizacao?: any;
    nomeEmpresa?: string;
    constructor(partial: any);
}
