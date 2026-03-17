import { Injectable } from '@nestjs/common';
import { QrScanRepository } from '../repositories/qr-scan.repository';
import { CredencialRepository } from '../repositories/credencial.repository';
import { BusinessException } from '../common/exceptions/business.exception';

@Injectable()
export class ScansService {
  constructor(
    private readonly qrScanRepository: QrScanRepository,
    private readonly credencialRepository: CredencialRepository
  ) {}

  async checkIn(ticketId: string, scannerId: string) {
    // 1. Verificar se a credencial existe e está ativa
    const credencial = await this.credencialRepository.findByTicketId(ticketId);
    if (!credencial) {
      throw new BusinessException('Credencial não encontrada ou inválida.', 404);
    }

    if (credencial.status !== 'ACTIVE') {
      throw new BusinessException('Esta credencial não está ativa.', 403);
    }

    // 2. Verificar se já existe check-in HOJE
    const existingScan = await this.qrScanRepository.findTodayRegistration(ticketId);
    if (existingScan) {
      return {
        success: true,
        alreadyScanned: true,
        message: 'Credencial já verificada hoje.',
        data: {
            nome: credencial.credenciado?.nomeCompleto || 'Desconhecido',
            ticketId
        }
      };
    }

    // 3. Registrar novo Scan
    await this.qrScanRepository.create({
      credencial: { connect: { ticketId: ticketId } },
      scannerId,
      scanType: 'CHECK_IN'
    });

    return {
      success: true,
      alreadyScanned: false,
      message: 'Acesso Liberado!',
      data: {
        nome: credencial.credenciado?.nomeCompleto || 'Desconhecido',
        ticketId
      }
    };
  }
}
