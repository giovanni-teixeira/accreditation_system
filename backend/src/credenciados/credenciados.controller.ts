import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CredenciadosService } from './credenciados.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CriarVisitanteDto } from './dto/criar-visitante.dto';
import { CriarCafeicultorDto } from './dto/criar-cafeicultor.dto';
import { CriarImprensaDto } from './dto/criar-imprensa.dto';
import { CriarExpositorDto } from './dto/criar-expositor.dto';

@ApiTags('Credenciamento')
@Controller('credenciados')
export class CredenciadosController {
    constructor(private readonly credenciadosService: CredenciadosService) { }

    @Post('visitante')
    @ApiOperation({ summary: 'Cadastro de Visitante', description: 'Rota para o público geral que não possui atributos extras além da base.' })
    @ApiResponse({ status: 201, description: 'Visitante cadastrado.' })
    async cadastrarVisitante(@Body() criarVisitanteDto: CriarVisitanteDto) {
        return this.credenciadosService.cadastrarVisitante(criarVisitanteDto);
    }

    @Post('cafeicultor')
    @ApiOperation({ summary: 'Cadastro de Cafeicultor', description: 'Requer dados da propriedade rural (CCIR).' })
    @ApiResponse({ status: 201, description: 'Cafeicultor cadastrado.' })
    async cadastrarCafeicultor(@Body() criarCafeicultorDto: CriarCafeicultorDto) {
        return this.credenciadosService.cadastrarCafeicultor(criarCafeicultorDto);
    }

    @Post('imprensa')
    @ApiOperation({ summary: 'Cadastro de Imprensa', description: 'Requer dados do veículo de comunicação.' })
    @ApiResponse({ status: 201, description: 'Profissional de imprensa cadastrado.' })
    async cadastrarImprensa(@Body() criarImprensaDto: CriarImprensaDto) {
        return this.credenciadosService.cadastrarImprensa(criarImprensaDto);
    }

    @Post('expositor')
    @ApiOperation({ summary: 'Cadastro de Expositor', description: 'Requer CNPJ e nome da empresa vinculada.' })
    @ApiResponse({ status: 201, description: 'Expositor cadastrado.' })
    async cadastrarExpositor(@Body() criarExpositorDto: CriarExpositorDto) {
        return this.credenciadosService.cadastrarExpositor(criarExpositorDto);
    }

    @Get('cpf/:cpf')
    @ApiOperation({ summary: 'Buscar credenciado por CPF', description: 'Retorna os dados cadastrados para um CPF específico.' })
    @ApiResponse({ status: 200, description: 'Dados encontrados.' })
    @ApiResponse({ status: 400, description: 'Credenciado não encontrado.' })
    async buscarPorCpf(@Param('cpf') cpf: string) {
        return this.credenciadosService.buscarPorCpf(cpf);
    }
}
