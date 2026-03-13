// src/repositories/address.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, EnderecoCache as PrismaEnderecoCache } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IEndereco } from '../domain/entities/endereco.entity';

@Injectable()
export class AddressRepository extends BaseRepository<
  IEndereco,
  Prisma.EnderecoCacheCreateInput,
  Prisma.EnderecoCacheUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    // Usamos o model enderecoCache para persistir o histórico de CEPs
    super(prisma, (prisma as any).enderecoCache);
  }

  async findByCep(cep: string): Promise<IEndereco | null> {
    const result = await (this.prisma as any).enderecoCache.findUnique({
      where: { cep },
    });

    return result as IEndereco | null;
  }
}
