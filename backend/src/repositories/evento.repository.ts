// src/repositories/evento.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BaseRepository } from './base.repository';
import { Evento, Prisma } from '@prisma/client';

@Injectable()
export class EventoRepository extends BaseRepository<Evento, Prisma.EventoCreateInput, Prisma.EventoUpdateInput> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.evento);
  }

  async findFirst() {
    return this.prisma.evento.findFirst();
  }
}
