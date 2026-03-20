import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IQrScan } from '../interfaces/qr-scan.interface';

@Injectable()
export class QrScanRepository extends BaseRepository<
  IQrScan,
  Prisma.QrScanCreateInput,
  Prisma.QrScanUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, (prisma as any).qrScan);
  }

  async findTodayRegistration(ticketId: string): Promise<IQrScan | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return await this.prisma.qrScan.findFirst({
      where: {
        ticketId,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    }) as IQrScan | null;
  }

  async getStatsByScanner() {
    return await this.prisma.qrScan.groupBy({
      by: ['scannerId'],
      _count: {
        id: true
      },
      _max: {
        createdAt: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });
  }

  async findLogs(filters: { 
    scannerId?: string; 
    ticketId?: string; 
    nome?: string; 
    startDate?: string;
    endDate?: string;
    limit?: number 
  }) {
    const where: any = {
      scannerId: filters.scannerId,
    };

    if (filters.ticketId) {
      where.ticketId = { contains: filters.ticketId };
    }

    if (filters.nome) {
      where.credencial = {
        credenciado: {
          nomeCompleto: { contains: filters.nome, mode: 'insensitive' }
        }
      };
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        if (filters.endDate.length <= 10) end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    return (this.prisma as any).qrScan.findMany({
      where,
      include: {
        credencial: {
          include: {
            credenciado: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 50,
    });
  }
}
