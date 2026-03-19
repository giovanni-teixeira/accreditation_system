import {
  Controller, Get, Param, Patch, Body, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { EventoRepository } from '../repositories/evento.repository';
import { EventoResponseDto } from '../dtos/response/evento-response.dto';
import { AtualizarEventoDto } from '../dtos/request/atualizar-evento.dto';
import { BusinessException } from '../common/exceptions/business.exception';
import { ROUTES } from '../routes/routes.constants';

@ApiTags('Eventos')
@Controller(ROUTES.EVENTOS.BASE)
export class EventosController {
  constructor(private readonly eventoRepository: EventoRepository) {}

  @Get()
  @ApiOperation({ summary: 'Listar o evento do sistema' })
  @ApiResponse({ status: 200, description: 'Evento retornado.' })
  async findAll() {
    const result = await this.eventoRepository.findFirst();
    if (!result) throw new BusinessException('Nenhum evento cadastrado.', 404);
    return new EventoResponseDto(result);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar dados do evento (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Evento atualizado.' })
  async update(@Param('id') id: string, @Body() dto: AtualizarEventoDto) {
    try {
      const result = await this.eventoRepository.update(id, dto);
      return new EventoResponseDto(result);
    } catch (error) {
      if (error instanceof BusinessException) throw error;
      throw new BusinessException(`Erro ao atualizar evento: ${error.message}`);
    }
  }
}
