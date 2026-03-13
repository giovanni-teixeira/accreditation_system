import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { ICredencial } from '../domain/entities/credencial.entity';
export declare class CredencialRepository extends BaseRepository<ICredencial, Prisma.CredencialCreateInput, Prisma.CredencialUpdateInput> {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService);
    findByTicketId(ticketId: string): Promise<ICredencial | null>;
}
