import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class EnderecoRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.EnderecoCreateWithoutCredenciadoInput, credenciadoId: string): Promise<{
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
    }>;
}
