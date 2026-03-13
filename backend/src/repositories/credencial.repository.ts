// src/repositories/credencial.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CredencialRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    data: Prisma.CredencialCreateWithoutCredenciadoInput,
    credenciadoId: string,
  ) {
    return this.prisma.credencial.create({
      data: {
        ...data,
        credenciado: { connect: { id: credenciadoId } },
      },
    });
  }

  async findByTicketId(ticketId: string) {
    return this.prisma.credencial.findUnique({
      where: { ticketId },
      include: { credenciado: true },
    });
  }
}
