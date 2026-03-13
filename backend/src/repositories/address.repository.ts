// src/repositories/address.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, EnderecoCache } from '@prisma/client';
import { BaseRepository } from './base.repository';

@Injectable()
export class AddressRepository extends BaseRepository<EnderecoCache, Prisma.EnderecoCacheCreateInput, Prisma.EnderecoCacheUpdateInput> {
    constructor(protected readonly prisma: PrismaService) {
        super(prisma, prisma.enderecoCache);
    }

    async findByCepAndCountry(cep: string, pais: string = 'Brasil') {
        return this.prisma.enderecoCache.findUnique({
            where: { cep },
        });
    }
}
