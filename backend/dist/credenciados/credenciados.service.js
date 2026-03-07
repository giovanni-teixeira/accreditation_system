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
exports.CredenciadosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let CredenciadosService = class CredenciadosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validarCpfUnico(cpf) {
        const existe = await this.prisma.credenciado.findUnique({ where: { cpf } });
        if (existe) {
            throw new common_1.BadRequestException('Já existe um credenciado com este CPF');
        }
    }
    async cadastrarVisitante(dto) {
        await this.validarCpfUnico(dto.cpf);
        return this.prisma.credenciado.create({
            data: {
                ...dto,
                tipo: 'Visitante',
            },
        });
    }
    async cadastrarCafeicultor(dto) {
        await this.validarCpfUnico(dto.cpf);
        return this.prisma.credenciado.create({
            data: {
                ...dto,
                tipo: 'Cafeicultor',
            },
        });
    }
    async cadastrarImprensa(dto) {
        await this.validarCpfUnico(dto.cpf);
        return this.prisma.credenciado.create({
            data: {
                ...dto,
                tipo: 'Imprensa',
            },
        });
    }
    async cadastrarExpositor(dto) {
        await this.validarCpfUnico(dto.cpf);
        return this.prisma.credenciado.create({
            data: {
                ...dto,
                tipo: 'Expositor',
            },
        });
    }
};
exports.CredenciadosService = CredenciadosService;
exports.CredenciadosService = CredenciadosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CredenciadosService);
//# sourceMappingURL=credenciados.service.js.map