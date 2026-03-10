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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateUser(login, pass) {
        const user = await this.prisma.usuarioOrganizacao.findUnique({ where: { login } });
        if (user && await bcrypt.compare(pass, user.senhaHash)) {
            const { senhaHash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.login, loginDto.senhaHash);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const payload = { sub: user.id, login: user.login, role: user.perfilAcesso };
        const access_token = this.jwtService.sign(payload);
        let publicKey = null;
        if (user.perfilAcesso === 'LEITOR_CATRACA') {
            const evento = await this.prisma.evento.findFirst();
            if (evento && evento.publicKey) {
                publicKey = evento.publicKey;
            }
        }
        return {
            access_token,
            publicKey,
            user: {
                id: user.id,
                login: user.login,
                role: user.perfilAcesso
            }
        };
    }
    async register(registerDto) {
        const saltRounds = 10;
        const hashData = await bcrypt.hash(registerDto.senhaPura, saltRounds);
        const novoUsuario = await this.prisma.usuarioOrganizacao.create({
            data: {
                login: registerDto.login,
                senhaHash: hashData,
                perfilAcesso: registerDto.perfilAcesso
            }
        });
        const { senhaHash, ...result } = novoUsuario;
        return result;
    }
    async onModuleInit() {
        const eventoSeedPath = path.join(process.cwd(), 'prisma', 'evento.seed.json');
        if (fs.existsSync(eventoSeedPath)) {
            const seedData = JSON.parse(fs.readFileSync(eventoSeedPath, 'utf8'));
            let evento = await this.prisma.evento.findFirst();
            if (!evento) {
                console.log('Semeadura Inicial: Criando Evento Padrão e inserindo Chaves Criptográficas estáticas...');
                await this.prisma.evento.create({ data: seedData });
            }
            else if (!evento.privateKey || !evento.publicKey) {
                console.log('Semeadura Inicial: Atualizando Evento Padrão com Chaves Criptográficas...');
                await this.prisma.evento.update({
                    where: { id: evento.id },
                    data: {
                        privateKey: seedData.privateKey,
                        publicKey: seedData.publicKey
                    }
                });
            }
        }
        const adminExists = await this.prisma.usuarioOrganizacao.findFirst({
            where: { perfilAcesso: 'ADMIN' }
        });
        if (!adminExists) {
            console.log('Semeadura Inicial: Criando usuário ADMIN padrão (login: admin, senha: admin)');
            const senhaPadrao = await bcrypt.hash('admin', 10);
            await this.prisma.usuarioOrganizacao.create({
                data: {
                    login: 'admin',
                    senhaHash: senhaPadrao,
                    perfilAcesso: 'ADMIN'
                }
            });
        }
        const scannerExists = await this.prisma.usuarioOrganizacao.findFirst({
            where: { login: 'scanner' }
        });
        if (!scannerExists) {
            console.log('Semeadura Inicial: Criando usuário LEITOR_CATRACA padrão (login: scanner, senha: scanner)');
            const senhaScanner = await bcrypt.hash('scanner', 10);
            await this.prisma.usuarioOrganizacao.create({
                data: {
                    login: 'scanner',
                    senhaHash: senhaScanner,
                    perfilAcesso: 'LEITOR_CATRACA'
                }
            });
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map