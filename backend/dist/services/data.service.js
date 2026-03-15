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
exports.DataService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let DataService = class DataService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listEventos() {
        return this.prisma.evento.findMany();
    }
    async listUsuariosOrganizacao() {
        return this.prisma.usuarioOrganizacao.findMany({
            select: {
                id: true,
                login: true,
                perfilAcesso: true,
                setor: true,
            },
        });
    }
    async listCredenciados() {
        return this.prisma.credenciado.findMany({
            include: {
                endereco: true,
                descarbonizacao: true,
                credencial: true,
            },
        });
    }
    async listEnderecos() {
        return this.prisma.endereco.findMany();
    }
    async listEnderecoCache() {
        return this.prisma.enderecoCache.findMany();
    }
    async listDescarbonizacao() {
        return this.prisma.descarbonizacao.findMany();
    }
    async listCredenciais() {
        return this.prisma.credencial.findMany();
    }
    async listQrScans() {
        return this.prisma.qrScan.findMany();
    }
};
exports.DataService = DataService;
exports.DataService = DataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DataService);
//# sourceMappingURL=data.service.js.map