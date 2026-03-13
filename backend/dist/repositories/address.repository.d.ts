import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IEndereco } from '../interfaces';
export declare class AddressRepository extends BaseRepository<IEndereco, Prisma.EnderecoCacheCreateInput, Prisma.EnderecoCacheUpdateInput> {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService);
    findByCep(cep: string): Promise<IEndereco | null>;
}
