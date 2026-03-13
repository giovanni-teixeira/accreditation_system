import { PrismaService } from '../prisma.service';
import { BaseRepository } from './base.repository';
import { Evento, Prisma } from '@prisma/client';
export declare class EventoRepository extends BaseRepository<Evento, Prisma.EventoCreateInput, Prisma.EventoUpdateInput> {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService);
    findFirst(): Promise<{
        id: string;
        nomeEvento: string;
        isGratuito: boolean;
        privateKey: string | null;
        publicKey: string | null;
    } | null>;
}
