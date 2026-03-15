import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class CommonRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createEndereco(data: Prisma.EnderecoCreateWithoutCredenciadoInput, credenciadoId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        latitude: number | null;
        longitude: number | null;
        cep: string | null;
        rua: string | null;
        bairro: string | null;
        cidade: string;
        estado: string;
        pais: string;
        credenciadoId: string;
    }>;
    createCredencial(data: Prisma.CredencialCreateWithoutCredenciadoInput, credenciadoId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ticketId: string;
        qrToken: string;
        downloads: number;
        printCount: number;
        status: string;
        credenciadoId: string;
    }>;
    createDescarbonizacao(data: Prisma.DescarbonizacaoCreateWithoutCredenciadoInput, credenciadoId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        distanciaIdaVoltaKm: number;
        tipoCombustivel: import(".prisma/client").$Enums.TipoCombustivel;
        latitudeOrigem: number | null;
        longitudeOrigem: number | null;
        pegadaCo2: number | null;
        credenciadoId: string;
    }>;
}
