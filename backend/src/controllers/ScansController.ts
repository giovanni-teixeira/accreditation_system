import {
  Controller,
  Post,
  Body,
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
  async checkIn(@Body() body: { ticketId: string }, @Request() req: any) {
    console.log('USER:', req.user);
    const scannerId = req.user?.userID || req.user?.id;
    if (!scannerId) {
      throw new Error('Usuario não autenticado ou token inválido');
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
    @Body() body: { ticketIds: string[] },
    @Request() req: any,
  ) {
    console.log('USER:', req.user);
    const scannerId = req.user?.userID || req.user?.id;

    if (!scannerId) {
      throw new Error('Usuário não autenticado ou token inválido');
    }
    return await this.scansService.bulkCheckIn(body.ticketIds, scannerId);
  }
}
