export declare enum PerfilAcesso {
    LEITOR_CATRACA = "LEITOR_CATRACA",
    ADMIN = "ADMIN"
}
export interface IUsuarioOrganizacao {
    id: string;
    login: string;
    senhaHash: string;
    perfilAcesso: PerfilAcesso;
    setor?: string;
    createdAt: Date;
    updatedAt: Date;
}
