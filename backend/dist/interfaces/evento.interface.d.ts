export interface IEvento {
    id: string;
    nomeEvento: string;
    isGratuito: boolean;
    localEvento?: string;
    latitude?: number;
    longitude?: number;
    privateKey?: string;
    publicKey?: string;
    createdAt: Date;
    updatedAt: Date;
}
