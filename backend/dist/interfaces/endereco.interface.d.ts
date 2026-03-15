export interface IEndereco {
    id: string;
    credenciadoId: string;
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    pais: string;
    latitude?: number;
    longitude?: number;
    createdAt: Date;
    updatedAt: Date;
}
