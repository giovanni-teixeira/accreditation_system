import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Descarbonizacao } from '@prisma/client';
import { BaseRepository } from './base.repository';

@Injectable()
export class DescarbonizacaoRepository extends BaseRepository<
  Descarbonizacao,
  Prisma.DescarbonizacaoCreateInput,
  Prisma.DescarbonizacaoUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.descarbonizacao);
  }

  async findAllWithCredenciado() {
    return this.prisma.descarbonizacao.findMany({
      include: {
        credenciado: {
          select: { nomeCompleto: true, cpf: true, tipoCategoria: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCredenciadoId(credenciadoId: string) {
    return this.prisma.descarbonizacao.findUnique({
      where: { credenciadoId },
      include: {
        credenciado: {
          select: { nomeCompleto: true, cpf: true, tipoCategoria: true },
        },
      },
    });
  }

  async getSummary() {
    const result = await this.prisma.descarbonizacao.aggregate({
      _sum: {
        distanciaIdaVoltaKm: true,
        pegadaCo2: true,
      },
      _count: { id: true },
    });
    return {
      totalParticipantes: result._count.id,
      totalDistanciaKm: result._sum.distanciaIdaVoltaKm ?? 0,
      totalCo2Kg: result._sum.pegadaCo2 ?? 0,
    };
  }
}
