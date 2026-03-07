import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CriarVisitanteDto } from './dto/criar-visitante.dto';
import { CriarCafeicultorDto } from './dto/criar-cafeicultor.dto';
import { CriarImprensaDto } from './dto/criar-imprensa.dto';
import { CriarExpositorDto } from './dto/criar-expositor.dto';

@Injectable()
export class CredenciadosService {
    constructor(private readonly prisma: PrismaService) { }

    async validarCpfUnico(cpf: string) {
        const existe = await this.prisma.credenciado.findUnique({ where: { cpf } });
        if (existe) {
            throw new BadRequestException('Já existe um credenciado com este CPF');
        }
    }

    async cadastrarVisitante(dto: CriarVisitanteDto) {
        await this.validarCpfUnico(dto.cpf);
        return this.prisma.credenciado.create({
            data: {
                ...dto,
                tipo: 'Visitante',
            },
        });
    }

    async cadastrarCafeicultor(dto: CriarCafeicultorDto) {
        await this.validarCpfUnico(dto.cpf);
        return this.prisma.credenciado.create({
            data: {
                ...dto,
                tipo: 'Cafeicultor',
            },
        });
    }

    async cadastrarImprensa(dto: CriarImprensaDto) {
        await this.validarCpfUnico(dto.cpf);
        return this.prisma.credenciado.create({
            data: {
                ...dto,
                tipo: 'Imprensa',
            },
        });
    }

    async cadastrarExpositor(dto: CriarExpositorDto) {
        await this.validarCpfUnico(dto.cpf);
        return this.prisma.credenciado.create({
            data: {
                ...dto,
                tipo: 'Expositor',
            },
        });
    }
}
