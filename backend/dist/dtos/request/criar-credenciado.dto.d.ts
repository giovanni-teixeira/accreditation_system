import { TipoCombustivel, TipoCategoria } from '@prisma/client';
export declare class CriarCredenciadoDto {
    nomeCompleto: string;
    cpf: string;
    rg?: string;
    celular: string;
    email: string;
    cep?: string;
    rua?: string;
    bairro?: string;
    cidade: string;
    estado: string;
    pais: string;
    aceiteLgpd: boolean;
    tipoCombustivel: TipoCombustivel;
    tipoCategoria: TipoCategoria;
    cnpj?: string;
    ccir?: string;
    nomeEmpresa?: string;
    siteEmpresa?: string;
    nomePropriedade?: string;
    nomeVeiculo?: string;
    distanciaManualKm?: number;
}
