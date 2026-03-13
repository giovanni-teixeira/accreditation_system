// src/repositories/credencial.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Credencial as PrismaCredencial } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { ICredencial } from '../interfaces';

@Injectable()
export class CredencialRepository extends BaseRepository<
  ICredencial,
  Prisma.CredencialCreateInput,
  Prisma.CredencialUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.credencial);
  }

  async findByTicketId(ticketId: string): Promise<ICredencial | null> {
    const result = await this.prisma.credencial.findUnique({
      where: { ticketId },
      include: {
        credenciado: true,
      },
    });

    return result as ICredencial | null;
  }
}
