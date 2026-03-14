// src/repositories/credenciado.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Credenciado as PrismaCredenciado } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { ICredenciado } from '../domain/entities/credenciado.entity';

@Injectable()
export class CredenciadoRepository extends BaseRepository<
  ICredenciado,
  Prisma.CredenciadoCreateInput,
  Prisma.CredenciadoUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.credenciado);
  }

  async findByCpf(cpf: string): Promise<ICredenciado | null> {
    const result = await this.prisma.credenciado.findUnique({
      where: { cpf },
      include: {
        credencial: true,
        endereco: true,
      },
    });

    return result as ICredenciado | null;
  }
}
