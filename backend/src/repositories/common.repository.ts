// src/repositories/common.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommonRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Endereço
  async createEndereco(
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

  // Credencial
  async createCredencial(
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

  // Descarbonização
  async createDescarbonizacao(
    data: Prisma.DescarbonizacaoCreateWithoutCredenciadoInput,
    credenciadoId: string,
  ) {
    return this.prisma.descarbonizacao.create({
      data: {
        ...data,
        credenciado: { connect: { id: credenciadoId } },
      },
    });
  }

  // QrScans e outros podem ser adicionados aqui...
}
