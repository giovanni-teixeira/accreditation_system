export declare enum TipoCategoria {
    EXPOSITOR = "EXPOSITOR",
    VISITANTE = "VISITANTE",
    PRODUTOR = "PRODUTOR",
    IMPRENSA = "IMPRENSA",
    ORGANIZACAO = "ORGANIZACAO",
    TERCEIRIZADO = "TERCEIRIZADO"
}
export interface ICredenciado {
    id: string;
    eventoId: string;
    tipoCategoria: TipoCategoria;
    nomeCompleto: string;
    cpf: string;
    rg: string;
    celular: string;
    email: string;
    cnpj?: string;
    ccir?: string;
    nomeEmpresa?: string;
    siteEmpresa?: string;
    aceiteLgpd: boolean;
}
