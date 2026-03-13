"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredenciadosController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
const criar_credenciado_dto_1 = require("../dtos/request/criar-credenciado.dto");
const credenciado_response_dto_1 = require("../dtos/response/credenciado-response.dto");
const credenciado_repository_1 = require("../repositories/credenciado.repository");
const evento_repository_1 = require("../repositories/evento.repository");
const qrcode_util_1 = require("../utils/qrcode.util");
let CredenciadosController = class CredenciadosController {
    credenciadoRepository;
    eventoRepository;
    constructor(credenciadoRepository, eventoRepository) {
        this.credenciadoRepository = credenciadoRepository;
        this.eventoRepository = eventoRepository;
    }
    async cadastrar(dto) {
        const evento = await this.eventoRepository.findFirst();
        if (!evento)
            throw new common_1.BadRequestException('Evento não encontrado');
        const existe = await this.credenciadoRepository.findByCpf(dto.cpf);
        if (existe)
            throw new common_1.BadRequestException('Já existe um credenciado com este CPF');
        const tokenDados = qrcode_util_1.QrCodeHelper.generateSignedToken(evento.id, evento.privateKey, dto.nomeCompleto);
        const { cep, rua, bairro, cidade, estado, tipoCategoria, ...dadosParticipante } = dto;
        const res = await this.credenciadoRepository.create({
            ...dadosParticipante,
            evento: { connect: { id: evento.id } },
            tipoCategoria: tipoCategoria,
            tipoCombustivel: dadosParticipante.tipoCombustivel || client_1.TipoCombustivel.GASOLINA,
            aceiteLgpd: true,
            endereco: { create: { cep, rua, bairro, cidade, estado } },
            credencial: {
                create: {
                    ticketId: tokenDados.ticketId,
                    qrToken: tokenDados.qrToken,
                    status: 'ACTIVE',
                },
            },
        });
        return new credenciado_response_dto_1.CredenciadoResponseDto(res);
    }
    async buscarPorCpf(cpf) {
        const res = await this.credenciadoRepository.findByCpf(cpf);
        if (!res)
            throw new common_1.BadRequestException('Não encontrado');
        return new credenciado_response_dto_1.CredenciadoResponseDto(res);
    }
};
exports.CredenciadosController = CredenciadosController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cadastro Unificado de Credenciados' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: credenciado_response_dto_1.CredenciadoResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [criar_credenciado_dto_1.CriarCredenciadoDto]),
    __metadata("design:returntype", Promise)
], CredenciadosController.prototype, "cadastrar", null);
__decorate([
    (0, common_1.Get)('cpf/:cpf'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar por CPF' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: credenciado_response_dto_1.CredenciadoResponseDto }),
    __param(0, (0, common_1.Param)('cpf')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CredenciadosController.prototype, "buscarPorCpf", null);
exports.CredenciadosController = CredenciadosController = __decorate([
    (0, swagger_1.ApiTags)('Credenciamento'),
    (0, common_1.Controller)('credenciados'),
    __metadata("design:paramtypes", [credenciado_repository_1.CredenciadoRepository,
        evento_repository_1.EventoRepository])
], CredenciadosController);
//# sourceMappingURL=CredenciadosController.js.map