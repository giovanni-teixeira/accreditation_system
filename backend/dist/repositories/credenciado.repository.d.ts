import { PrismaService } from '../prisma.service';
import { Prisma, Credenciado } from '@prisma/client';
import { BaseRepository } from './base.repository';
export declare class CredenciadoRepository extends BaseRepository<Credenciado, Prisma.CredenciadoCreateInput, Prisma.CredenciadoUpdateInput> {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService);
    findByCpf(cpf: string): Promise<({
        endereco: {
            id: string;
            latitude: number | null;
            longitude: number | null;
            credenciadoId: string;
            cep: string;
            rua: string;
            bairro: string;
            cidade: string;
            estado: string;
            pais: string;
        } | null;
        credencial: {
            id: string;
            credenciadoId: string;
            ticketId: string;
            qrToken: string;
            downloads: number;
            printCount: number;
            status: string;
            createdAt: Date;
        } | null;
    } & {
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
    }) | null>;
}
