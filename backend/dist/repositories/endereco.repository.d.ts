import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { BaseRepository } from './base.repository';
import { IEndereco } from '../domain/entities/endereco.entity';
export declare class EnderecoRepository extends BaseRepository<IEndereco, Prisma.EnderecoCreateInput, Prisma.EnderecoUpdateInput> {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService);
    findByCredenciadoId(credenciadoId: string): Promise<IEndereco | null>;
}
