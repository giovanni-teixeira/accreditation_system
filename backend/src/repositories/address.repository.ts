// src/repositories/address.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, EnderecoCache as PrismaEnderecoCache } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IEndereco } from '../interfaces';

@Injectable()
export class AddressRepository extends BaseRepository<
  IEndereco,
  Prisma.EnderecoCacheCreateInput,
  Prisma.EnderecoCacheUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.enderecoCache);
  }

  async findByCep(cep: string): Promise<IEndereco | null> {
    const result = await this.prisma.enderecoCache.findUnique({
      where: { cep },
    });

    return result as IEndereco | null;
  }
}
