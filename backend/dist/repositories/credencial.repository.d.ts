import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { ICredencial } from '../interfaces/credencial.interface';
export declare class CredencialRepository extends BaseRepository<ICredencial, Prisma.CredencialCreateInput, Prisma.CredencialUpdateInput> {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService);
    findByTicketId(ticketId: string): Promise<ICredencial | null>;
}
