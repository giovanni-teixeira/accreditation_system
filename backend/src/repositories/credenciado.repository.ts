// src/repositories/credenciado.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Credenciado } from '@prisma/client';
import { BaseRepository } from './base.repository';

@Injectable()
export class CredenciadoRepository extends BaseRepository<Credenciado, Prisma.CredenciadoCreateInput, Prisma.CredenciadoUpdateInput> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.credenciado);
  }

  async findByCpf(cpf: string) {
    return this.prisma.credenciado.findUnique({
      where: { cpf },
      include: {
        credencial: true,
        endereco: true,
      },
    });
  }
}
