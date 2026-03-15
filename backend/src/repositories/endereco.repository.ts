// src/repositories/endereco.repository.ts
import { Injectable } from '@nestjs/common';
import { Prisma, Endereco as PrismaEndereco } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { BaseRepository } from './base.repository';
import { IEndereco } from '../interfaces/endereco.interface';

@Injectable()
export class EnderecoRepository extends BaseRepository<
  IEndereco,
  Prisma.EnderecoCreateInput,
  Prisma.EnderecoUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.endereco);
  }

  async findByCredenciadoId(credenciadoId: string): Promise<IEndereco | null> {
    const result = await this.prisma.endereco.findUnique({
      where: { credenciadoId },
    });

    return result as IEndereco | null;
  }
}

