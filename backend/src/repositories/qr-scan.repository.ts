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
}
