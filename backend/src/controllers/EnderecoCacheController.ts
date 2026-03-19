import {
  Controller, Get, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { PrismaService } from '../prisma.service';
import { BusinessException } from '../common/exceptions/business.exception';

@ApiTags('Endereços')
@Controller('endereco-cache')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class EnderecoCacheController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar cache de CEPs consultados (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Cache de endereços retornado.' })
  async findAll() {
    try {
      return await this.prisma.enderecoCache.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new BusinessException(`Erro ao buscar cache de endereços: ${error.message}`);
    }
  }
}
