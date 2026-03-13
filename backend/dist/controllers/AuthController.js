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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const qrcode_util_1 = require("../utils/qrcode.util");
const business_exception_1 = require("../common/exceptions/business.exception");
const swagger_1 = require("@nestjs/swagger");
const login_dto_1 = require("../dtos/request/login.dto");
const register_dto_1 = require("../dtos/request/register.dto");
const usuario_repository_1 = require("../repositories/usuario.repository");
const evento_repository_1 = require("../repositories/evento.repository");
const credenciado_repository_1 = require("../repositories/credenciado.repository");
const usuario_response_dto_1 = require("../dtos/response/usuario-response.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
const roles_decorator_1 = require("./decorators/roles.decorator");
const routes_constants_1 = require("../routes/routes.constants");
let AuthController = class AuthController {
    usuarioRepository;
    eventoRepository;
    credenciadoRepository;
    jwtService;
    configService;
    constructor(usuarioRepository, eventoRepository, credenciadoRepository, jwtService, configService) {
        this.usuarioRepository = usuarioRepository;
        this.eventoRepository = eventoRepository;
        this.credenciadoRepository = credenciadoRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async login(loginDto) {
        try {
            const user = await this.usuarioRepository.findByLogin(loginDto.login);
            if (!user ||
                !(await bcrypt.compare(loginDto.senhaHash, user.senhaHash))) {
                throw new business_exception_1.BusinessException('Usuário ou senha inválidos. Por favor, verifique suas credenciais.', 401);
            }
            const payload = {
                sub: user.id,
                login: user.login,
                role: user.perfilAcesso,
            };
            const access_token = this.jwtService.sign(payload);
            let publicKey = null;
            if (user.perfilAcesso === 'LEITOR_CATRACA') {
                const evento = await this.eventoRepository.findFirst();
                if (evento && evento.publicKey) {
                    publicKey = evento.publicKey;
                }
            }
            return {
                access_token,
                publicKey,
                user: new usuario_response_dto_1.UsuarioResponseDto(user),
            };
        }
        catch (error) {
            if (error instanceof business_exception_1.BusinessException)
                throw error;
            throw new business_exception_1.BusinessException(`Falha na autenticação: ${error.message}`);
        }
    }
    async register(registerDto) {
        try {
            const saltRounds = 10;
            const hashData = await bcrypt.hash(registerDto.senhaPura, saltRounds);
            const novoUsuario = await this.usuarioRepository.create({
                login: registerDto.login,
                senhaHash: hashData,
                perfilAcesso: registerDto.perfilAcesso,
            });
            return new usuario_response_dto_1.UsuarioResponseDto(novoUsuario);
        }
        catch (error) {
            if (error instanceof business_exception_1.BusinessException)
                throw error;
            throw new business_exception_1.BusinessException(`Erro ao registrar usuário: ${error.message}`);
        }
    }
    async onModuleInit() {
        const eventoSeedPath = path.join(process.cwd(), 'prisma', 'evento.seed.json');
        if (fs.existsSync(eventoSeedPath)) {
            const seedData = JSON.parse(fs.readFileSync(eventoSeedPath, 'utf8'));
            const evento = await this.eventoRepository.findFirst();
            if (!evento) {
                console.log('Semeadura Inicial: Criando Evento Padrão...');
                await this.eventoRepository.create({
                    ...seedData,
                    localEvento: 'Clube de Campo, Franca, SP',
                    latitude: -20.651167,
                    longitude: -47.477722,
                });
            }
            else if (!evento.privateKey ||
                !evento.publicKey ||
                !evento.latitude ||
                !evento.localEvento) {
                await this.eventoRepository.update(evento.id, {
                    privateKey: seedData.privateKey,
                    publicKey: seedData.publicKey,
                    localEvento: 'Clube de Campo, Franca, SP',
                    latitude: -20.651167,
                    longitude: -47.477722,
                });
            }
        }
        const adminLogin = this.configService.get('ADMIN_LOGIN');
        if (adminLogin) {
            const adminExists = await this.usuarioRepository.findByLogin(adminLogin);
            if (!adminExists) {
                console.log(`Gerando Usuário Admin: ${adminLogin}...`);
                const password = this.configService.get('ADMIN_PASSWORD');
                const hash = await bcrypt.hash(password || 'admin123', 10);
                await this.usuarioRepository.create({
                    login: adminLogin,
                    senhaHash: hash,
                    perfilAcesso: 'ADMIN',
                    setor: 'ADMINISTRAÇÃO',
                });
                const evento = await this.eventoRepository.findFirst();
                const adminCpf = this.configService.get('ADMIN_CPF') || '00000000000';
                const adminName = this.configService.get('ADMIN_NAME') || 'ADMINISTRADOR';
                const credExists = await this.credenciadoRepository.findByCpf(adminCpf);
                if (!credExists && evento) {
                    const tokenDados = qrcode_util_1.QrCodeHelper.generateSignedToken(evento.id, evento.privateKey, adminName);
                    await this.credenciadoRepository.create({
                        nomeCompleto: adminName,
                        cpf: adminCpf,
                        rg: '00000000',
                        celular: '00000000000',
                        email: this.configService.get('ADMIN_EMAIL') ||
                            'admin@sistema.com',
                        tipoCategoria: 'ORGANIZACAO',
                        aceiteLgpd: true,
                        evento: { connect: { id: evento.id } },
                        descarbonizacao: {
                            create: {
                                distanciaIdaVoltaKm: 0,
                                tipoCombustivel: 'GASOLINA',
                                pegadaCo2: 0,
                            },
                        },
                        credencial: {
                            create: {
                                ticketId: tokenDados.ticketId,
                                qrToken: tokenDados.qrToken,
                                status: 'ACTIVE',
                            },
                        },
                    });
                    console.log(`Credencial do Admin gerada com sucesso.`);
                }
            }
        }
        const scannerLogin = this.configService.get('SCANNER_LOGIN');
        if (scannerLogin) {
            const scannerExists = await this.usuarioRepository.findByLogin(scannerLogin);
            if (!scannerExists) {
                console.log(`Gerando Usuário Scanner: ${scannerLogin}...`);
                const password = this.configService.get('SCANNER_PASSWORD');
                const hash = await bcrypt.hash(password || 'scanner123', 10);
                await this.usuarioRepository.create({
                    login: scannerLogin,
                    senhaHash: hash,
                    perfilAcesso: 'LEITOR_CATRACA',
                    setor: 'PORTARIA',
                });
                const evento = await this.eventoRepository.findFirst();
                const scannerCpf = this.configService.get('SCANNER_CPF') || '11111111111';
                const scannerName = this.configService.get('SCANNER_NAME') || 'LEITOR CATRACA';
                const credExists = await this.credenciadoRepository.findByCpf(scannerCpf);
                if (!credExists && evento) {
                    const tokenDados = qrcode_util_1.QrCodeHelper.generateSignedToken(evento.id, evento.privateKey, scannerName);
                    await this.credenciadoRepository.create({
                        nomeCompleto: scannerName,
                        cpf: scannerCpf,
                        rg: '11111111',
                        celular: '11111111111',
                        email: 'scanner@sistema.com',
                        tipoCategoria: 'ORGANIZACAO',
                        aceiteLgpd: true,
                        evento: { connect: { id: evento.id } },
                        descarbonizacao: {
                            create: {
                                distanciaIdaVoltaKm: 0,
                                tipoCombustivel: 'GASOLINA',
                                pegadaCo2: 0,
                            },
                        },
                        credencial: {
                            create: {
                                ticketId: tokenDados.ticketId,
                                qrToken: tokenDados.qrToken,
                                status: 'ACTIVE',
                            },
                        },
                    });
                    console.log(`Credencial do Scanner gerada com sucesso.`);
                }
            }
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)(routes_constants_1.ROUTES.AUTH.LOGIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Logar no sistema (Retorna JWT e PublicKey se for Scanner)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logado com sucesso.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Credenciais inválidas.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)(routes_constants_1.ROUTES.AUTH.REGISTER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo usuário na organização (Apenas ADMIN)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Usuário registrado com sucesso.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão de acesso.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('autenticacao'),
    (0, common_1.Controller)(routes_constants_1.ROUTES.AUTH.BASE),
    __metadata("design:paramtypes", [usuario_repository_1.UsuarioRepository,
        evento_repository_1.EventoRepository,
        credenciado_repository_1.CredenciadoRepository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=AuthController.js.map