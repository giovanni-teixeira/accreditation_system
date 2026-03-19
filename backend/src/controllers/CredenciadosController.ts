import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { TipoCategoria, TipoCombustivel } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CriarCredenciadoDto } from '../dtos/request/criar-credenciado.dto';
import { AtualizarCredenciadoDto } from '../dtos/request/atualizar-credenciado.dto';
import { CredenciadoResponseDto } from '../dtos/response/credenciado-response.dto';
import { CredenciadoRepository } from '../repositories/credenciado.repository';
import { EventoRepository } from '../repositories/evento.repository';
import { QrCodeHelper } from '../utils/qrcode.util';
import { AddressService } from '../services/address.service';
import { CalculationHelper } from '../utils/calculation.helper';
import { BusinessException } from '../common/exceptions/business.exception';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

import { ROUTES } from '../routes/routes.constants';

@ApiTags('Credenciamento')
@Controller(ROUTES.CREDENCIADOS.BASE)
export class CredenciadosController {
  constructor(
    private readonly credenciadoRepository: CredenciadoRepository,
    private readonly eventoRepository: EventoRepository,
    private readonly addressService: AddressService,
  ) {}

  @Post(ROUTES.CREDENCIADOS.CRIAR)
  @ApiOperation({ summary: 'Cadastro Unificado de Credenciados' })
  @ApiResponse({ status: 201, type: CredenciadoResponseDto })
  async cadastrar(@Body() dto: CriarCredenciadoDto) {
    try {
      const evento = await this.eventoRepository.findFirst();
      if (!evento)
        throw new BusinessException('Evento não encontrado no sistema.');

      const existe = await this.credenciadoRepository.findByCpf(dto.cpf);
      if (existe)
        throw new BusinessException(
          'Já existe um credenciado com este documento informado.',
        );

      const tokenDados = QrCodeHelper.generateSignedToken(
        evento.id,
        evento.privateKey!,
        dto.nomeCompleto,
      );

      // 4. Buscar Localização (Geo) do Credenciado e do Evento
      const addressData = dto.cep 
        ? await this.addressService.getAddress(dto.cep, dto.pais || 'Brasil')
        : null;

      const latOrigem = addressData?.latitude || null;
      const lonOrigem = addressData?.longitude || null;
      let distanciaKm = 0;
      let pegadaCo2 = 0;

      if (latOrigem && lonOrigem && evento.latitude && evento.longitude) {
        distanciaKm = CalculationHelper.calculateDistance(
          latOrigem,
          lonOrigem,
          evento.latitude,
          evento.longitude,
        );
        pegadaCo2 = CalculationHelper.calculateCo2Footprint(
          distanciaKm,
          dto.tipoCombustivel,
        );
      }

      const {
        tipoCategoria,
        tipoCombustivel,
        cep,
        rua,
        bairro,
        cidade,
        estado,
        pais,
        ...dadosParticipante
      } = dto;

      const res = await this.credenciadoRepository.create(
        {
          nomeCompleto: dto.nomeCompleto,
          cpf: dto.cpf,
          rg: dto.rg,
          celular: dto.celular,
          email: dto.email,
          cnpj: dto.cnpj,
          ccir: dto.ccir,
          nomeEmpresa: dto.nomeEmpresa,
          siteEmpresa: dto.siteEmpresa,
          nomePropriedade: dto.nomePropriedade,
          nomeVeiculo: dto.nomeVeiculo,
          aceiteLgpd: dto.aceiteLgpd,
          tipoCategoria: tipoCategoria,
          evento: { connect: { id: evento.id } },
          endereco: {
            create: {
              cep: dto.cep ?? null,
              rua: dto.rua ?? null,
              bairro: dto.bairro ?? null,
              cidade: dto.cidade,
              estado: dto.estado,
              latitude: latOrigem,
              longitude: lonOrigem,
              pais: dto.pais || 'Brasil',
            },
          },
          descarbonizacao: {
            create: {
              distanciaIdaVoltaKm: dto.distanciaManualKm ? Number(dto.distanciaManualKm) * 2 : distanciaKm * 2,
              tipoCombustivel: tipoCombustivel,
              latitudeOrigem: latOrigem,
              longitudeOrigem: lonOrigem,
              pegadaCo2: dto.distanciaManualKm 
                ? CalculationHelper.calculateCo2Footprint(Number(dto.distanciaManualKm), tipoCombustivel) * 2 
                : pegadaCo2,
            },
          },
          credencial: {
            create: {
              ticketId: tokenDados.ticketId,
              qrToken: tokenDados.qrToken,
              status: 'ACTIVE',
            },
          },
        },
        { credencial: true, endereco: true, descarbonizacao: true },
      );

      return new CredenciadoResponseDto(res);
    } catch (error) {
      if (error instanceof BusinessException) throw error;
      throw new BusinessException(
        `Erro ao processar o cadastro: ${error.message}`,
      );
    }
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Listar todos os credenciados (ADMIN)' })
  @ApiResponse({ status: 200, type: [CredenciadoResponseDto] })
  async findAll() {
    const result = await this.credenciadoRepository.findAll({ credencial: true, endereco: true });
    return result.map((c) => new CredenciadoResponseDto(c));
  }

  @Get(ROUTES.CREDENCIADOS.BUSCAR_CPF)
  @ApiOperation({ summary: 'Buscar por CPF (público)' })
  @ApiResponse({ status: 200, type: CredenciadoResponseDto })
  async buscarPorCpf(@Param('cpf') cpf: string) {
    try {
      const res = await this.credenciadoRepository.findByCpf(cpf);
      if (!res)
        throw new BusinessException(
          'Documento não encontrado nos registros.',
          404,
        );
      return new CredenciadoResponseDto(res);
    } catch (error) {
      if (error instanceof BusinessException) throw error;
      throw new BusinessException(
        `Erro ao buscar credenciado: ${error.message}`,
      );
    }
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Buscar credenciado por ID (ADMIN)' })
  @ApiResponse({ status: 200, type: CredenciadoResponseDto })
  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  async findById(@Param('id') id: string) {
    const result = await this.credenciadoRepository.findById(id, { credencial: true, endereco: true });
    if (!result) throw new BusinessException('Credenciado não encontrado.', 404);
    return new CredenciadoResponseDto(result);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar credenciado parcialmente (ADMIN)' })
  @ApiResponse({ status: 200, type: CredenciadoResponseDto })
  async update(@Param('id') id: string, @Body() dto: AtualizarCredenciadoDto) {
    try {
      const { tipoCombustivel, cep, cidade, estado, pais, distanciaManualKm, ...rest } = dto;
      const result = await this.credenciadoRepository.update(id, rest as any);
      return new CredenciadoResponseDto(result);
    } catch (error) {
      if (error instanceof BusinessException) throw error;
      throw new BusinessException(`Erro ao atualizar: ${error.message}`);
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Deletar credenciado (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Deletado com sucesso.' })
  async delete(@Param('id') id: string) {
    try {
      await this.credenciadoRepository.delete(id);
      return { message: 'Credenciado removido com sucesso.' };
    } catch (error) {
      if (error instanceof BusinessException) throw error;
      throw new BusinessException(`Erro ao deletar: ${error.message}`);
    }
  }
}
