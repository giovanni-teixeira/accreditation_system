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

import { ROUTES } from '../routes/routes.constants';

@ApiTags('Credenciamento')
@Controller(ROUTES.CREDENCIADOS.BASE)
export class CredenciadosController {
  constructor(
    private readonly credenciadoRepository: CredenciadoRepository,
    private readonly eventoRepository: EventoRepository,
    private readonly addressService: AddressService,
  ) { }

  @Post(ROUTES.CREDENCIADOS.CRIAR)
  @ApiOperation({ summary: 'Cadastro Unificado de Credenciados' })
  @ApiResponse({ status: 201, type: CredenciadoResponseDto })
  async cadastrar(@Body() dto: CriarCredenciadoDto) {
    const evento = await this.eventoRepository.findFirst();
    if (!evento) throw new BadRequestException('Evento não encontrado');

    const existe = await this.credenciadoRepository.findByCpf(dto.cpf);
    if (existe)
      throw new BadRequestException('Já existe um credenciado com este CPF');

    const tokenDados = QrCodeHelper.generateSignedToken(
      evento.id,
      evento.privateKey!,
      dto.nomeCompleto,
    );

    // 4. Buscar Localização (Geo) do Credenciado e do Evento
    const addressData = await this.addressService.getAddress(dto.cep, 'Brasil');
    
    let latOrigem = addressData?.latitude || null;
    let lonOrigem = addressData?.longitude || null;
    let distanciaKm = 0;
    let pegadaCo2 = 0;

    // Forçamos o tipo para garantir que o TS veja os campos novos do Prisma
    const eventoAny = evento as any;

    if (latOrigem && lonOrigem && eventoAny.latitude && eventoAny.longitude) {
      distanciaKm = CalculationHelper.calculateDistance(
        latOrigem, lonOrigem, 
        eventoAny.latitude, eventoAny.longitude
      );
      pegadaCo2 = CalculationHelper.calculateCo2Footprint(distanciaKm, dto.tipoCombustivel);
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

    const res = await this.credenciadoRepository.create({
      nomeCompleto: dto.nomeCompleto,
      cpf: dto.cpf,
      rg: dto.rg,
      celular: dto.celular,
      email: dto.email,
      cnpj: dto.cnpj,
      ccir: dto.ccir,
      nomeEmpresa: dto.nomeEmpresa,
      siteEmpresa: dto.siteEmpresa,
      aceiteLgpd: true,
      tipoCategoria: tipoCategoria,
      evento: { connect: { id: evento.id } },
      endereco: { 
        create: { 
          cep: dto.cep, 
          rua: dto.rua, 
          bairro: dto.bairro, 
          cidade: dto.cidade, 
          estado: dto.estado,
          latitude: latOrigem,
          longitude: lonOrigem,
          pais: 'Brasil'
        } 
      },
      descarbonizacao: {
        create: {
          distanciaIdaVoltaKm: distanciaKm * 2,
          tipoCombustivel: tipoCombustivel,
          latitudeOrigem: latOrigem,
          longitudeOrigem: lonOrigem,
          pegadaCo2: pegadaCo2,
        } as any
      },
      credencial: {
        create: {
          ticketId: tokenDados.ticketId,
          qrToken: tokenDados.qrToken,
          status: 'ACTIVE',
        },
      },
    } as any, { credencial: true, endereco: true, descarbonizacao: true } as any);

    return new CredenciadoResponseDto(res);
  }

  @Get(ROUTES.CREDENCIADOS.BUSCAR_CPF)
  @ApiOperation({ summary: 'Buscar por CPF' })
  @ApiResponse({ status: 200, type: CredenciadoResponseDto })
  async buscarPorCpf(@Param('cpf') cpf: string) {
    const res = await this.credenciadoRepository.findByCpf(cpf);
    if (!res) throw new BadRequestException('Não encontrado');
    return new CredenciadoResponseDto(res);
  }
}
