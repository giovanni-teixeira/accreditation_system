import { CriarVisitanteDto } from './dto/criar-visitante.dto';
import { CriarCafeicultorDto } from './dto/criar-cafeicultor.dto';
import { CriarImprensaDto } from './dto/criar-imprensa.dto';
import { CriarExpositorDto } from './dto/criar-expositor.dto';
import { TipoCategoria } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as nacl from 'tweetnacl';
import * as util from 'tweetnacl-util';
import * as crypto from 'crypto';
@Injectable()
export class CredenciadosService {
  constructor(private readonly prisma: PrismaService) { }

  private async getEventoPadrao() {
    let evento = await this.prisma.evento.findFirst();

    if (!evento || !evento.privateKey || !evento.publicKey) {
      throw new BadRequestException('O Evento base ou as Chaves Criptográficas não estão configuradas. Reinicie o servidor para efetuar o Seeding Automático.');
    }

    return evento;
  }

  private gerarCredencialAssinada(eventoId: string, privateKeyBase64: string, nome: string) {
    const ticketId = crypto.randomUUID();
    const payload = {
      e: eventoId,
      t: ticketId,
      n: nome,
      iat: Date.now()
    };

    const message = util.decodeUTF8(JSON.stringify(payload));
    const privateKey = util.decodeBase64(privateKeyBase64);

    const signature = nacl.sign.detached(message, privateKey);
    // Formato: payloadBase64.signatureBase64
    const token = util.encodeBase64(message) + "." + util.encodeBase64(signature);

    return { ticketId, qrToken: token };
  }

  async validarCpfUnico(cpf: string) {
    const existe = await this.prisma.credenciado.findUnique({
      where: {
        cpf
      }
    });
    if (existe) {
      throw new BadRequestException('Já existe um credenciado com este CPF neste evento');
    }
  }

  async buscarPorCpf(cpf: string) {
    // Assume busca global pelo CPF do evento atual (ideal seria receber o eventoId)
    const credenciado = await this.prisma.credenciado.findUnique({
      where: { cpf },
      include: { credencial: true, endereco: true }
    });
    if (!credenciado) {
      throw new BadRequestException('Credenciado não encontrado para o CPF informado');
    }
    return credenciado;
  }

  async cadastrarVisitante(dto: CriarVisitanteDto) {
    const evento = await this.getEventoPadrao();
    await this.validarCpfUnico(dto.cpf);

    const { cep, rua, bairro, cidade, estado, ...dadosParticipante } = dto;
    const credencialDados = this.gerarCredencialAssinada(evento.id, evento.privateKey!, dto.nomeCompleto);

    return this.prisma.credenciado.create({
      data: {
        ...dadosParticipante,
        evento: { connect: { id: evento.id } },
        tipoCategoria: TipoCategoria.VISITANTE,
        endereco: { create: { cep, rua, bairro, cidade, estado } },
        credencial: {
          create: {
            ticketId: credencialDados.ticketId,
            qrToken: credencialDados.qrToken,
            status: 'ACTIVE'
          }
        }
      },
      include: { credencial: true, endereco: true }
    });
  }

  async cadastrarCafeicultor(dto: CriarCafeicultorDto) {
    const evento = await this.getEventoPadrao();
    await this.validarCpfUnico(dto.cpf);

    const { cep, rua, bairro, cidade, estado, ...dadosParticipante } = dto;
    const credencialDados = this.gerarCredencialAssinada(evento.id, evento.privateKey!, dto.nomeCompleto);

    return this.prisma.credenciado.create({
      data: {
        ...dadosParticipante,
        evento: { connect: { id: evento.id } },
        tipoCategoria: TipoCategoria.CAFEICULTOR,
        endereco: { create: { cep, rua, bairro, cidade, estado } },
        credencial: {
          create: {
            ticketId: credencialDados.ticketId,
            qrToken: credencialDados.qrToken,
            status: 'ACTIVE'
          }
        }
      },
      include: { credencial: true, endereco: true }
    });
  }

  async cadastrarImprensa(dto: CriarImprensaDto) {
    const evento = await this.getEventoPadrao();
    await this.validarCpfUnico(dto.cpf);

    const { cep, rua, bairro, cidade, estado, ...dadosParticipante } = dto;
    const credencialDados = this.gerarCredencialAssinada(evento.id, evento.privateKey!, dto.nomeCompleto);

    return this.prisma.credenciado.create({
      data: {
        ...dadosParticipante,
        evento: { connect: { id: evento.id } },
        tipoCategoria: TipoCategoria.IMPRENSA,
        endereco: { create: { cep, rua, bairro, cidade, estado } },
        credencial: {
          create: {
            ticketId: credencialDados.ticketId,
            qrToken: credencialDados.qrToken,
            status: 'ACTIVE'
          }
        }
      },
      include: { credencial: true, endereco: true }
    });
  }

  async cadastrarExpositor(dto: CriarExpositorDto) {
    const evento = await this.getEventoPadrao();
    await this.validarCpfUnico(dto.cpf);

    const { cep, rua, bairro, cidade, estado, ...dadosParticipante } = dto;
    const credencialDados = this.gerarCredencialAssinada(evento.id, evento.privateKey!, dto.nomeCompleto);

    return this.prisma.credenciado.create({
      data: {
        ...dadosParticipante,
        evento: { connect: { id: evento.id } },
        tipoCategoria: TipoCategoria.EXPOSITOR,
        endereco: { create: { cep, rua, bairro, cidade, estado } },
        credencial: {
          create: {
            ticketId: credencialDados.ticketId,
            qrToken: credencialDados.qrToken,
            status: 'ACTIVE'
          }
        }
      },
      include: { credencial: true, endereco: true }
    });
  }
}

