import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { ICredenciado } from '../domain/entities/credenciado.entity';
export declare class CredenciadoRepository extends BaseRepository<ICredenciado, Prisma.CredenciadoCreateInput, Prisma.CredenciadoUpdateInput> {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService);
    findByCpf(cpf: string): Promise<ICredenciado | null>;
}
