"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredenciadosService = void 0;
const client_1 = require("@prisma/client");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const nacl = __importStar(require("tweetnacl"));
const util = __importStar(require("tweetnacl-util"));
const uuid_1 = require("uuid");
let CredenciadosService = class CredenciadosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getEventoPadrao() {
        let evento = await this.prisma.evento.findFirst();
        if (!evento || !evento.privateKey || !evento.publicKey) {
            throw new common_1.BadRequestException('O Evento base ou as Chaves Criptográficas não estão configuradas. Reinicie o servidor para efetuar o Seeding Automático.');
        }
        return evento;
    }
    gerarCredencialAssinada(eventoId, privateKeyBase64, nome) {
        const ticketId = (0, uuid_1.v4)();
        const payload = {
            e: eventoId,
            t: ticketId,
            n: nome,
            iat: Date.now()
        };
        const message = util.decodeUTF8(JSON.stringify(payload));
        const privateKey = util.decodeBase64(privateKeyBase64);
        const signature = nacl.sign.detached(message, privateKey);
        const token = util.encodeBase64(message) + "." + util.encodeBase64(signature);
        return { ticketId, qrToken: token };
    }
    async validarCpfUnico(cpf) {
        const existe = await this.prisma.credenciado.findUnique({
            where: {
                cpf
            }
        });
        if (existe) {
            throw new common_1.BadRequestException('Já existe um credenciado com este CPF neste evento');
        }
    }
    async buscarPorCpf(cpf) {
        const credenciado = await this.prisma.credenciado.findUnique({
            where: { cpf },
            include: { credencial: true, endereco: true }
        });
        if (!credenciado) {
            throw new common_1.BadRequestException('Credenciado não encontrado para o CPF informado');
        }
        return credenciado;
    }
    async cadastrarVisitante(dto) {
        const evento = await this.getEventoPadrao();
        await this.validarCpfUnico(dto.cpf);
        const { cep, rua, bairro, cidade, estado, ...dadosParticipante } = dto;
        const credencialDados = this.gerarCredencialAssinada(evento.id, evento.privateKey, dto.nomeCompleto);
        return this.prisma.credenciado.create({
            data: {
                ...dadosParticipante,
                evento: { connect: { id: evento.id } },
                tipoCategoria: client_1.TipoCategoria.VISITANTE,
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
    async cadastrarCafeicultor(dto) {
        const evento = await this.getEventoPadrao();
        await this.validarCpfUnico(dto.cpf);
        const { cep, rua, bairro, cidade, estado, ...dadosParticipante } = dto;
        const credencialDados = this.gerarCredencialAssinada(evento.id, evento.privateKey, dto.nomeCompleto);
        return this.prisma.credenciado.create({
            data: {
                ...dadosParticipante,
                evento: { connect: { id: evento.id } },
                tipoCategoria: client_1.TipoCategoria.CAFEICULTOR,
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
    async cadastrarImprensa(dto) {
        const evento = await this.getEventoPadrao();
        await this.validarCpfUnico(dto.cpf);
        const { cep, rua, bairro, cidade, estado, ...dadosParticipante } = dto;
        const credencialDados = this.gerarCredencialAssinada(evento.id, evento.privateKey, dto.nomeCompleto);
        return this.prisma.credenciado.create({
            data: {
                ...dadosParticipante,
                evento: { connect: { id: evento.id } },
                tipoCategoria: client_1.TipoCategoria.IMPRENSA,
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
    async cadastrarExpositor(dto) {
        const evento = await this.getEventoPadrao();
        await this.validarCpfUnico(dto.cpf);
        const { cep, rua, bairro, cidade, estado, ...dadosParticipante } = dto;
        const credencialDados = this.gerarCredencialAssinada(evento.id, evento.privateKey, dto.nomeCompleto);
        return this.prisma.credenciado.create({
            data: {
                ...dadosParticipante,
                evento: { connect: { id: evento.id } },
                tipoCategoria: client_1.TipoCategoria.EXPOSITOR,
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
};
exports.CredenciadosService = CredenciadosService;
exports.CredenciadosService = CredenciadosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CredenciadosService);
//# sourceMappingURL=credenciados.service.js.map