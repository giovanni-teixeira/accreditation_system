import { PrismaService } from '../prisma.service';
import { Prisma, EnderecoCache } from '@prisma/client';
import { BaseRepository } from './base.repository';
export declare class AddressRepository extends BaseRepository<EnderecoCache, Prisma.EnderecoCacheCreateInput, Prisma.EnderecoCacheUpdateInput> {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService);
    findByCepAndCountry(cep: string, pais?: string): Promise<{
        id: string;
        latitude: number | null;
        longitude: number | null;
        cep: string;
        rua: string;
        bairro: string;
        cidade: string;
        estado: string;
        pais: string;
        atualizado: Date;
    } | null>;
}
