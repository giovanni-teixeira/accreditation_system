// src/repositories/endereco.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EnderecoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.EnderecoCreateWithoutCredenciadoInput,
    credenciadoId: string,
  ) {
    return this.prisma.endereco.create({
      data: {
        ...data,
        credenciado: { connect: { id: credenciadoId } },
      },
    });
  }
}
