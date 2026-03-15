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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const data_service_1 = require("../services/data.service");
const routes_constants_1 = require("../routes/routes.constants");
let DataController = class DataController {
    dataService;
    constructor(dataService) {
        this.dataService = dataService;
    }
    async getEventos() {
        return this.dataService.listEventos();
    }
    async getUsuarios() {
        return this.dataService.listUsuariosOrganizacao();
    }
    async getCredenciados() {
        return this.dataService.listCredenciados();
    }
    async getEnderecos() {
        return this.dataService.listEnderecos();
    }
    async getEnderecoCache() {
        return this.dataService.listEnderecoCache();
    }
    async getDescarbonizacao() {
        return this.dataService.listDescarbonizacao();
    }
    async getCredenciais() {
        return this.dataService.listCredenciais();
    }
    async getQrScans() {
        return this.dataService.listQrScans();
    }
};
exports.DataController = DataController;
__decorate([
    (0, common_1.Get)(routes_constants_1.ROUTES.DATA.EVENTOS),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os eventos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataController.prototype, "getEventos", null);
__decorate([
    (0, common_1.Get)(routes_constants_1.ROUTES.DATA.USUARIOS_ORGANIZACAO),
    (0, swagger_1.ApiOperation)({ summary: 'Listar usuários da organização' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataController.prototype, "getUsuarios", null);
__decorate([
    (0, common_1.Get)(routes_constants_1.ROUTES.DATA.CREDENCIADOS),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os credenciados (com relações)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataController.prototype, "getCredenciados", null);
__decorate([
    (0, common_1.Get)(routes_constants_1.ROUTES.DATA.ENDERECOS),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os endereços' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataController.prototype, "getEnderecos", null);
__decorate([
    (0, common_1.Get)(routes_constants_1.ROUTES.DATA.ENDERECO_CACHE),
    (0, swagger_1.ApiOperation)({ summary: 'Listar cache de CEPs' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataController.prototype, "getEnderecoCache", null);
__decorate([
    (0, common_1.Get)(routes_constants_1.ROUTES.DATA.DESCARBONIZACAO),
    (0, swagger_1.ApiOperation)({ summary: 'Listar dados de descarbonização' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataController.prototype, "getDescarbonizacao", null);
__decorate([
    (0, common_1.Get)(routes_constants_1.ROUTES.DATA.CREDENCIAL),
    (0, swagger_1.ApiOperation)({ summary: 'Listar credenciais geradas' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataController.prototype, "getCredenciais", null);
__decorate([
    (0, common_1.Get)(routes_constants_1.ROUTES.DATA.QR_SCANS),
    (0, swagger_1.ApiOperation)({ summary: 'Listar histórico de scans de QR Code' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataController.prototype, "getQrScans", null);
exports.DataController = DataController = __decorate([
    (0, swagger_1.ApiTags)('Data Export'),
    (0, common_1.Controller)(routes_constants_1.ROUTES.DATA.BASE),
    __metadata("design:paramtypes", [data_service_1.DataService])
], DataController);
//# sourceMappingURL=DataController.js.map