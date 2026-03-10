import { CriarVisitanteDto } from './dto/criar-visitante.dto';
import { CriarCafeicultorDto } from './dto/criar-cafeicultor.dto';
import { CriarImprensaDto } from './dto/criar-imprensa.dto';
import { CriarExpositorDto } from './dto/criar-expositor.dto';
import { TipoCategoria } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as nacl from 'tweetnacl';
import * as util from 'tweetnacl-util';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CredenciadosService {
  constructor(private readonly prisma: PrismaService) { }

  private async getEventoPadrao() {
    let evento = await this.prisma.evento.findFirst();

    if (evento && (evento.nomeEvento !== 'FEIRA ALTACAFÉ 6° EDIÇÃO' || !evento.isGratuito)) {
      evento = await this.prisma.evento.update({
        where: { id: evento.id },
        data: { nomeEvento: 'FEIRA ALTACAFÉ 6° EDIÇÃO', isGratuito: true }
      });
    }

    if (!evento) {
      const keyPair = nacl.sign.keyPair();
      evento = await this.prisma.evento.create({
        data: {
          nomeEvento: 'FEIRA ALTACAFÉ 6° EDIÇÃO',
          isGratuito: true,
          privateKey: util.encodeBase64(keyPair.secretKey),
          publicKey: util.encodeBase64(keyPair.publicKey)
        }
      });
    } else if (!evento.privateKey || !evento.publicKey) {
      const keyPair = nacl.sign.keyPair();
      evento = await this.prisma.evento.update({
        where: { id: evento.id },
        data: {
          privateKey: util.encodeBase64(keyPair.secretKey),
          publicKey: util.encodeBase64(keyPair.publicKey)
        }
      });
    }
    return evento;
  }

  private gerarCredencialAssinada(eventoId: string, privateKeyBase64: string, nome: string) {
    const ticketId = uuidv4();
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

