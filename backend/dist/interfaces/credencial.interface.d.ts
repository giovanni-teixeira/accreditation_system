import { ICredenciado } from './credenciado.interface';
export interface ICredencial {
    id: string;
    credenciadoId: string;
    ticketId: string;
    qrToken: string;
    status: string;
    downloads: number;
    printCount: number;
    createdAt: Date;
    updatedAt: Date;
    credenciado?: ICredenciado;
}
