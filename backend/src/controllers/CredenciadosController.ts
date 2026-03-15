import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { TipoCategoria, TipoCombustivel } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CriarCredenciadoDto } from '../dtos/request/criar-credenciado.dto';
import { CredenciadoResponseDto } from '../dtos/response/credenciado-response.dto';
import { CredenciadoRepository } from '../repositories/credenciado.repository';
import { EventoRepository } from '../repositories/evento.repository';
import { QrCodeHelper } from '../utils/qrcode.util';
import { AddressService } from '../services/address.service';
import { CalculationHelper } from '../utils/calculation.helper';
import { BusinessException } from '../common/exceptions/business.exception';

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
          'Já existe um credenciado com este CPF informado.',
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

  @Get(ROUTES.CREDENCIADOS.BUSCAR_CPF)
  @ApiOperation({ summary: 'Buscar por CPF' })
  @ApiResponse({ status: 200, type: CredenciadoResponseDto })
  async buscarPorCpf(@Param('cpf') cpf: string) {
    try {
      const res = await this.credenciadoRepository.findByCpf(cpf);
      if (!res)
        throw new BusinessException(
          'Nenhum credenciado encontrado para o CPF informado.',
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
}
