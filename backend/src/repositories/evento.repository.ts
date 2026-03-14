// src/repositories/evento.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Evento as PrismaEvento } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IEvento } from '../domain/entities/evento.entity';

@Injectable()
export class EventoRepository extends BaseRepository<
  IEvento,
  Prisma.EventoCreateInput,
  Prisma.EventoUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.evento);
  }

  async findFirst(): Promise<IEvento | null> {
    const result = await this.prisma.evento.findFirst({
      include: {
        credenciados: true,
      },
    });

    return result as IEvento | null;
  }
}
