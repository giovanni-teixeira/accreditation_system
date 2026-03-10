import { CriarVisitanteDto } from './dto/criar-visitante.dto';
import { CriarCafeicultorDto } from './dto/criar-cafeicultor.dto';
import { CriarImprensaDto } from './dto/criar-imprensa.dto';
import { CriarExpositorDto } from './dto/criar-expositor.dto';
import { TipoCategoria } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

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
      evento = await this.prisma.evento.create({
        data: {
          nomeEvento: 'FEIRA ALTACAFÉ 6° EDIÇÃO',
          isGratuito: true
        }
      });
    }
    return evento;
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
    const credenciado = await this.prisma.credenciado.findUnique({ where: { cpf } });
    if (!credenciado) {
      throw new BadRequestException('Credenciado não encontrado para o CPF informado');
    }
    return credenciado;
  }

  async cadastrarVisitante(dto: CriarVisitanteDto) {
    const evento = await this.getEventoPadrao();
    await this.validarCpfUnico(dto.cpf);

    const { cep, rua, bairro, cidade, estado, ...dadosParticipante } = dto;

    return this.prisma.credenciado.create({
      data: {
        ...dadosParticipante,
        evento: { connect: { id: evento.id } },
        tipoCategoria: TipoCategoria.VISITANTE,
        endereco: { create: { cep, rua, bairro, cidade, estado } }
      },
    });
  }

  async cadastrarCafeicultor(dto: CriarCafeicultorDto) {
    const evento = await this.getEventoPadrao();
    await this.validarCpfUnico(dto.cpf);

    const { cep, rua, bairro, cidade, estado, ...dadosParticipante } = dto;

    return this.prisma.credenciado.create({
      data: {
        ...dadosParticipante,
        evento: { connect: { id: evento.id } },
        tipoCategoria: TipoCategoria.CAFEICULTOR,
        endereco: { create: { cep, rua, bairro, cidade, estado } }
      },
    });
  }

  async cadastrarImprensa(dto: CriarImprensaDto) {
    const evento = await this.getEventoPadrao();
    await this.validarCpfUnico(dto.cpf);

    const { cep, rua, bairro, cidade, estado, ...dadosParticipante } = dto;

    return this.prisma.credenciado.create({
      data: {
        ...dadosParticipante,
        evento: { connect: { id: evento.id } },
        tipoCategoria: TipoCategoria.IMPRENSA,
        endereco: { create: { cep, rua, bairro, cidade, estado } }
      },
    });
  }

  async cadastrarExpositor(dto: CriarExpositorDto) {
    const evento = await this.getEventoPadrao();
    await this.validarCpfUnico(dto.cpf);

    const { cep, rua, bairro, cidade, estado, ...dadosParticipante } = dto;

    return this.prisma.credenciado.create({
      data: {
        ...dadosParticipante,
        evento: { connect: { id: evento.id } },
        tipoCategoria: TipoCategoria.EXPOSITOR,
        endereco: { create: { cep, rua, bairro, cidade, estado } }
      },
    });
  }
}

