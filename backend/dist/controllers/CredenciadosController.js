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
const swagger_1 = require("@nestjs/swagger");
const criar_credenciado_dto_1 = require("../dtos/request/criar-credenciado.dto");
const credenciado_response_dto_1 = require("../dtos/response/credenciado-response.dto");
const credenciado_repository_1 = require("../repositories/credenciado.repository");
const evento_repository_1 = require("../repositories/evento.repository");
const qrcode_util_1 = require("../utils/qrcode.util");
const address_service_1 = require("../services/address.service");
const calculation_helper_1 = require("../utils/calculation.helper");
const business_exception_1 = require("../common/exceptions/business.exception");
const routes_constants_1 = require("../routes/routes.constants");
let CredenciadosController = class CredenciadosController {
    credenciadoRepository;
    eventoRepository;
    addressService;
    constructor(credenciadoRepository, eventoRepository, addressService) {
        this.credenciadoRepository = credenciadoRepository;
        this.eventoRepository = eventoRepository;
        this.addressService = addressService;
    }
    async cadastrar(dto) {
        try {
            const evento = await this.eventoRepository.findFirst();
            if (!evento)
                throw new business_exception_1.BusinessException('Evento não encontrado no sistema.');
            const existe = await this.credenciadoRepository.findByCpf(dto.cpf);
            if (existe)
                throw new business_exception_1.BusinessException('Já existe um credenciado com este CPF informado.');
            const tokenDados = qrcode_util_1.QrCodeHelper.generateSignedToken(evento.id, evento.privateKey, dto.nomeCompleto);
            const addressData = dto.cep
                ? await this.addressService.getAddress(dto.cep, dto.pais || 'Brasil')
                : null;
            const latOrigem = addressData?.latitude || null;
            const lonOrigem = addressData?.longitude || null;
            let distanciaKm = 0;
            let pegadaCo2 = 0;
            if (latOrigem && lonOrigem && evento.latitude && evento.longitude) {
                distanciaKm = calculation_helper_1.CalculationHelper.calculateDistance(latOrigem, lonOrigem, evento.latitude, evento.longitude);
                pegadaCo2 = calculation_helper_1.CalculationHelper.calculateCo2Footprint(distanciaKm, dto.tipoCombustivel);
            }
            const { tipoCategoria, tipoCombustivel, cep, rua, bairro, cidade, estado, pais, ...dadosParticipante } = dto;
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
                            ? calculation_helper_1.CalculationHelper.calculateCo2Footprint(Number(dto.distanciaManualKm), tipoCombustivel) * 2
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
            }, { credencial: true, endereco: true, descarbonizacao: true });
            return new credenciado_response_dto_1.CredenciadoResponseDto(res);
        }
        catch (error) {
            if (error instanceof business_exception_1.BusinessException)
                throw error;
            throw new business_exception_1.BusinessException(`Erro ao processar o cadastro: ${error.message}`);
        }
    }
    async buscarPorCpf(cpf) {
        try {
            const res = await this.credenciadoRepository.findByCpf(cpf);
            if (!res)
                throw new business_exception_1.BusinessException('Nenhum credenciado encontrado para o CPF informado.', 404);
            return new credenciado_response_dto_1.CredenciadoResponseDto(res);
        }
        catch (error) {
            if (error instanceof business_exception_1.BusinessException)
                throw error;
            throw new business_exception_1.BusinessException(`Erro ao buscar credenciado: ${error.message}`);
        }
    }
};
exports.CredenciadosController = CredenciadosController;
__decorate([
    (0, common_1.Post)(routes_constants_1.ROUTES.CREDENCIADOS.CRIAR),
    (0, swagger_1.ApiOperation)({ summary: 'Cadastro Unificado de Credenciados' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: credenciado_response_dto_1.CredenciadoResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [criar_credenciado_dto_1.CriarCredenciadoDto]),
    __metadata("design:returntype", Promise)
], CredenciadosController.prototype, "cadastrar", null);
__decorate([
    (0, common_1.Get)(routes_constants_1.ROUTES.CREDENCIADOS.BUSCAR_CPF),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar por CPF' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: credenciado_response_dto_1.CredenciadoResponseDto }),
    __param(0, (0, common_1.Param)('cpf')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CredenciadosController.prototype, "buscarPorCpf", null);
exports.CredenciadosController = CredenciadosController = __decorate([
    (0, swagger_1.ApiTags)('Credenciamento'),
    (0, common_1.Controller)(routes_constants_1.ROUTES.CREDENCIADOS.BASE),
    __metadata("design:paramtypes", [credenciado_repository_1.CredenciadoRepository,
        evento_repository_1.EventoRepository,
        address_service_1.AddressService])
], CredenciadosController);
//# sourceMappingURL=CredenciadosController.js.map