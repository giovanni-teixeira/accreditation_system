import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class CommonRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createEndereco(data: Prisma.EnderecoCreateWithoutCredenciadoInput, credenciadoId: string): Promise<{
        id: string;
        latitude: number | null;
        longitude: number | null;
        cep: string;
        rua: string;
        bairro: string;
        cidade: string;
        estado: string;
        pais: string;
        credenciadoId: string;
    }>;
    createCredencial(data: Prisma.CredencialCreateWithoutCredenciadoInput, credenciadoId: string): Promise<{
        id: string;
        credenciadoId: string;
        ticketId: string;
        qrToken: string;
        downloads: number;
        printCount: number;
        status: string;
        createdAt: Date;
    }>;
    createDescarbonizacao(data: Prisma.DescarbonizacaoCreateWithoutCredenciadoInput, credenciadoId: string): Promise<{
        id: string;
        tipoCombustivel: import(".prisma/client").$Enums.TipoCombustivel;
        credenciadoId: string;
        distanciaIdaVoltaKm: number;
        latitudeOrigem: number | null;
        longitudeOrigem: number | null;
        pegadaCo2: number | null;
    }>;
}
