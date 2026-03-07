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
const credenciados_service_1 = require("./credenciados.service");
const swagger_1 = require("@nestjs/swagger");
const criar_visitante_dto_1 = require("./dto/criar-visitante.dto");
const criar_cafeicultor_dto_1 = require("./dto/criar-cafeicultor.dto");
const criar_imprensa_dto_1 = require("./dto/criar-imprensa.dto");
const criar_expositor_dto_1 = require("./dto/criar-expositor.dto");
let CredenciadosController = class CredenciadosController {
    credenciadosService;
    constructor(credenciadosService) {
        this.credenciadosService = credenciadosService;
    }
    async cadastrarVisitante(criarVisitanteDto) {
        return this.credenciadosService.cadastrarVisitante(criarVisitanteDto);
    }
    async cadastrarCafeicultor(criarCafeicultorDto) {
        return this.credenciadosService.cadastrarCafeicultor(criarCafeicultorDto);
    }
    async cadastrarImprensa(criarImprensaDto) {
        return this.credenciadosService.cadastrarImprensa(criarImprensaDto);
    }
    async cadastrarExpositor(criarExpositorDto) {
        return this.credenciadosService.cadastrarExpositor(criarExpositorDto);
    }
    async buscarPorCpf(cpf) {
        return this.credenciadosService.buscarPorCpf(cpf);
    }
};
exports.CredenciadosController = CredenciadosController;
__decorate([
    (0, common_1.Post)('visitante'),
    (0, swagger_1.ApiOperation)({ summary: 'Cadastro de Visitante', description: 'Rota para o público geral que não possui atributos extras além da base.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Visitante cadastrado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [criar_visitante_dto_1.CriarVisitanteDto]),
    __metadata("design:returntype", Promise)
], CredenciadosController.prototype, "cadastrarVisitante", null);
__decorate([
    (0, common_1.Post)('cafeicultor'),
    (0, swagger_1.ApiOperation)({ summary: 'Cadastro de Cafeicultor', description: 'Requer dados da propriedade rural (CCIR).' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Cafeicultor cadastrado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [criar_cafeicultor_dto_1.CriarCafeicultorDto]),
    __metadata("design:returntype", Promise)
], CredenciadosController.prototype, "cadastrarCafeicultor", null);
__decorate([
    (0, common_1.Post)('imprensa'),
    (0, swagger_1.ApiOperation)({ summary: 'Cadastro de Imprensa', description: 'Requer dados do veículo de comunicação.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Profissional de imprensa cadastrado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [criar_imprensa_dto_1.CriarImprensaDto]),
    __metadata("design:returntype", Promise)
], CredenciadosController.prototype, "cadastrarImprensa", null);
__decorate([
    (0, common_1.Post)('expositor'),
    (0, swagger_1.ApiOperation)({ summary: 'Cadastro de Expositor', description: 'Requer CNPJ e nome da empresa vinculada.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Expositor cadastrado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [criar_expositor_dto_1.CriarExpositorDto]),
    __metadata("design:returntype", Promise)
], CredenciadosController.prototype, "cadastrarExpositor", null);
__decorate([
    (0, common_1.Get)('cpf/:cpf'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar credenciado por CPF', description: 'Retorna os dados cadastrados para um CPF específico.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dados encontrados.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Credenciado não encontrado.' }),
    __param(0, (0, common_1.Param)('cpf')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CredenciadosController.prototype, "buscarPorCpf", null);
exports.CredenciadosController = CredenciadosController = __decorate([
    (0, swagger_1.ApiTags)('Credenciamento'),
    (0, common_1.Controller)('credenciados'),
    __metadata("design:paramtypes", [credenciados_service_1.CredenciadosService])
], CredenciadosController);
//# sourceMappingURL=credenciados.controller.js.map