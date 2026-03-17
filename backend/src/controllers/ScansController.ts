import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
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
  @ApiOperation({ summary: 'Registrar check-in de uma credencial (Unicidade diária)' })
  @ApiResponse({ status: 200, description: 'Check-in processado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @ApiResponse({ status: 404, description: 'Credencial não encontrada.' })
  async checkIn(@Body() body: { ticketId: string }, @Request() req: any) {
    const scannerId = req.user.sub; // ID do usuário que está logado no scanner
    return await this.scansService.checkIn(body.ticketId, scannerId);
  }
}
