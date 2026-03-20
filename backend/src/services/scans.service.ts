import { Injectable } from '@nestjs/common';
import { QrScanRepository } from '../repositories/qr-scan.repository';
import { CredencialRepository } from '../repositories/credencial.repository';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { BusinessException } from '../common/exceptions/business.exception';

@Injectable()
export class ScansService {
  constructor(
    private readonly qrScanRepository: QrScanRepository,
    private readonly credencialRepository: CredencialRepository,
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async checkIn(ticketId: string, scannerId: string) {
    // 1. Verificar se a credencial existe e está ativa
    const credencial = await this.credencialRepository.findByTicketId(ticketId);
    if (!credencial) {
      throw new BusinessException(
        'Credencial não encontrada ou inválida.',
        404,
      );
    }

    if (credencial.status !== 'ACTIVE') {
      throw new BusinessException('Esta credencial não está ativa.', 403);
    }

    // 2. Verificar se já existe check-in HOJE
    const existingScan =
      await this.qrScanRepository.findTodayRegistration(ticketId);
    if (existingScan) {
      return {
        success: true,
        alreadyScanned: true,
        message: 'Credencial já verificada hoje.',
        data: {
          nome: credencial.credenciado?.nomeCompleto || 'Desconhecido',
          ticketId,
        },
      };
    }

    // 3. Registrar novo Scan
    await this.qrScanRepository.create({
      credencial: { connect: { ticketId: ticketId } },
      scannerId,
      scanType: 'CHECK_IN',
    });

    return {
      success: true,
      alreadyScanned: false,
      message: 'Acesso Liberado!',
      data: {
        nome: credencial.credenciado?.nomeCompleto || 'Desconhecido',
        ticketId,
      },
    };
  }

  async bulkCheckIn(ticketIds: string[], scannerId: string) {
    const results = {
      processed: 0,
      alreadyScanned: 0,
      errors: 0,
    };

    // Usamos um loop controlado para garantir que cada registro seja validado individualmente hoje
    // Mas a chamada do banco é sequencial rápida dentro do ambiente node
    for (const ticketId of ticketIds) {
      try {
        const res = await this.checkIn(ticketId, scannerId);
        if (res.alreadyScanned) {
          results.alreadyScanned++;
        } else {
          results.processed++;
        }
      } catch (err) {
        results.errors++;
      }
    }

    return results;
  }

  async getScannerActivities() {
    // 1. Obter estatísticas brutas do repositório
    const stats = await this.qrScanRepository.getStatsByScanner();

    // 2. Buscar nomes dos usuários organizacionais
    const enrichedStats = await Promise.all(
      stats.map(async (s) => {
        const user = await this.usuarioRepository.findById(s.scannerId);
        return {
          scannerId: s.scannerId,
          scannerName: user ? user.login : `ID: ${s.scannerId}`,
          setor: user?.setor || 'N/A',
          totalScans: s._count.id,
          lastScanAt: s._max.createdAt,
        };
      }),
    );

    return enrichedStats;
  }

  async getScanLogs(filters: { scannerId?: string; ticketId?: string; nome?: string; limit?: number }) {
    const logs = await this.qrScanRepository.findLogs(filters);

    return Promise.all(
      logs.map(async (log: any) => {
        const scanner = await this.usuarioRepository.findById(log.scannerId);
        const credencial = log.credencial;
        const credenciado = credencial?.credenciado;

        return {
          id: log.id,
          ticketId: log.ticketId,
          scanType: log.scanType,
          createdAt: log.createdAt,
          scannerName: scanner ? scanner.login : `ID: ${log.scannerId}`,
          credenciadoNome: credenciado ? credenciado.nomeCompleto : 'Desconhecido',
          credenciadoCpf: credenciado ? credenciado.cpf : 'N/A',
          tipoCategoria: credenciado ? credenciado.tipoCategoria : 'N/A',
        };
      }),
    );
  }
}
