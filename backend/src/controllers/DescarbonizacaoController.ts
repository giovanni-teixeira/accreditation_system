import {
  Controller, Get, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { DescarbonizacaoRepository } from '../repositories/descarbonizacao.repository';
import { BusinessException } from '../common/exceptions/business.exception';
import { ROUTES } from '../routes/routes.constants';

@ApiTags('Descarbonização')
@Controller(ROUTES.DESCARBONIZACAO.BASE)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class DescarbonizacaoController {
  constructor(private readonly descarbonizacaoRepository: DescarbonizacaoRepository) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os registros de descarbonização com dados do credenciado' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  async findAll() {
    try {
      return await this.descarbonizacaoRepository.findAllWithCredenciado();
    } catch (error) {
      throw new BusinessException(`Erro ao buscar descarbonizações: ${error.message}`);
    }
  }

  @Get(ROUTES.DESCARBONIZACAO.SUMMARY)
  @ApiOperation({ summary: 'Resumo geral: total de CO2 e distância de todos os participantes' })
  @ApiResponse({ status: 200, description: 'Resumo retornado com sucesso.' })
  async getSummary() {
    try {
      return await this.descarbonizacaoRepository.getSummary();
    } catch (error) {
      throw new BusinessException(`Erro ao calcular resumo: ${error.message}`);
    }
  }

  @Get(ROUTES.DESCARBONIZACAO.BY_CREDENCIADO)
  @ApiOperation({ summary: 'Buscar descarbonização de um credenciado específico' })
  @ApiResponse({ status: 200, description: 'Encontrado.' })
  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  async findByCredenciado(@Param('credenciadoId') credenciadoId: string) {
    try {
      const result = await this.descarbonizacaoRepository.findByCredenciadoId(credenciadoId);
      if (!result) throw new BusinessException('Registro de descarbonização não encontrado.', 404);
      return result;
    } catch (error) {
      if (error instanceof BusinessException) throw error;
      throw new BusinessException(`Erro ao buscar: ${error.message}`);
    }
  }
}
