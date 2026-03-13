import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IEvento } from '../interfaces';
export declare class EventoRepository extends BaseRepository<IEvento, Prisma.EventoCreateInput, Prisma.EventoUpdateInput> {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService);
    findFirst(): Promise<IEvento | null>;
}
