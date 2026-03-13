import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class CredencialRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.CredencialCreateWithoutCredenciadoInput, credenciadoId: string): Promise<{
        id: string;
        credenciadoId: string;
        ticketId: string;
        qrToken: string;
        downloads: number;
        printCount: number;
        status: string;
        createdAt: Date;
    }>;
    findByTicketId(ticketId: string): Promise<({
        credenciado: {
            nomeCompleto: string;
            cpf: string;
            rg: string;
            celular: string;
            email: string;
            id: string;
            eventoId: string;
            tipoCategoria: import(".prisma/client").$Enums.TipoCategoria;
            cnpj: string | null;
            ccir: string | null;
            nomeEmpresa: string | null;
            siteEmpresa: string | null;
            aceiteLgpd: boolean;
        };
    } & {
        id: string;
        credenciadoId: string;
        ticketId: string;
        qrToken: string;
        downloads: number;
        printCount: number;
        status: string;
        createdAt: Date;
    }) | null>;
}
