import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { ScansService } from '../services/scans.service';

import { CheckInDto } from '../dtos/request/check-in.dto';
import { CheckInBatchDto } from '../dtos/request/check-in-batch.dto';

interface ScannerRequest extends Request {
  user: {
    userId: string;
    login: string;
    role: string;
  };
}

@ApiTags('scans')
@Controller('scans')
export class ScansController {
  constructor(private readonly scansService: ScansService) {}

  @Post('check-in')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'LEITOR_CATRACA')
  @ApiOperation({
    summary: 'Registrar check-in de uma credencial (Unicidade diária)',
  })
  @ApiResponse({ status: 200, description: 'Check-in processado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @ApiResponse({ status: 404, description: 'Credencial não encontrada.' })
  async checkIn(@Body() body: CheckInDto, @Request() req: ScannerRequest) {
    const scannerId = req.user?.userId;
    if (!scannerId) {
      throw new Error('Usuário não autenticado ou token inválido');
    }
    return await this.scansService.checkIn(body.ticketId, scannerId);
  }

  @Post('check-in-batch')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'LEITOR_CATRACA')
  @ApiOperation({
    summary: 'Sincronizar múltiplos scans de uma vez (Scalability)',
  })
  @ApiResponse({ status: 200, description: 'Lote processado.' })
  async checkInBatch(
    @Body() body: CheckInBatchDto,
    @Request() req: ScannerRequest,
  ) {
    const scannerId = req.user?.userId;

    if (!scannerId) {
      throw new Error('Usuário não autenticado ou token inválido');
    }
    return await this.scansService.bulkCheckIn(body.ticketIds, scannerId);
  }

  @Get('activities')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Obter estatísticas de atividades por scanner (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'Estatísticas recuperadas.' })
  @Get('activities')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Obter estatísticas de atividades por scanner (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'Estatísticas recuperadas.' })
  async getActivities() {
    return await this.scansService.getScannerActivities();
  }

  @Get('logs')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Obter logs detalhados de capturas com filtros (Admin only)',
  })
  async getLogs(
    @Query('scannerId') scannerId?: string,
    @Query('ticketId') ticketId?: string,
    @Query('limit') limit?: string,
  ) {
    return await this.scansService.getScanLogs({
      scannerId,
      ticketId,
      limit: limit ? parseInt(limit) : 50,
    });
  }
}
