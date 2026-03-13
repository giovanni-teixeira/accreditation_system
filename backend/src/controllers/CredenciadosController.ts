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

import { ROUTES } from '../routes/routes.constants';

@ApiTags('Credenciamento')
@Controller(ROUTES.CREDENCIADOS.BASE)
export class CredenciadosController {
  constructor(
    private readonly credenciadoRepository: CredenciadoRepository,
    private readonly eventoRepository: EventoRepository,
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

    const {
      cep,
      rua,
      bairro,
      cidade,
      estado,
      tipoCategoria,
      ...dadosParticipante
    } = dto;

    const res = await this.credenciadoRepository.create({
      ...dadosParticipante,
      evento: { connect: { id: evento.id } },
      tipoCategoria: tipoCategoria,
      tipoCombustivel:
        dadosParticipante.tipoCombustivel || TipoCombustivel.GASOLINA,
      aceiteLgpd: true,
      endereco: { create: { cep, rua, bairro, cidade, estado } },
      credencial: {
        create: {
          ticketId: tokenDados.ticketId,
          qrToken: tokenDados.qrToken,
          status: 'ACTIVE',
        },
      },
    }, { credencial: true, endereco: true });

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
