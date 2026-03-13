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
const bcrypt = __importStar(require("bcrypt"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const swagger_1 = require("@nestjs/swagger");
const login_dto_1 = require("../dtos/request/login.dto");
const register_dto_1 = require("../dtos/request/register.dto");
const usuario_repository_1 = require("../repositories/usuario.repository");
const evento_repository_1 = require("../repositories/evento.repository");
const usuario_response_dto_1 = require("../dtos/response/usuario-response.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
const roles_decorator_1 = require("./decorators/roles.decorator");
let AuthController = class AuthController {
    usuarioRepository;
    eventoRepository;
    jwtService;
    constructor(usuarioRepository, eventoRepository, jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.eventoRepository = eventoRepository;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const user = await this.usuarioRepository.findByLogin(loginDto.login);
        if (!user || !(await bcrypt.compare(loginDto.senhaHash, user.senhaHash))) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
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
    async register(registerDto) {
        const saltRounds = 10;
        const hashData = await bcrypt.hash(registerDto.senhaPura, saltRounds);
        const novoUsuario = await this.usuarioRepository.create({
            login: registerDto.login,
            senhaHash: hashData,
            perfilAcesso: registerDto.perfilAcesso,
        });
        return new usuario_response_dto_1.UsuarioResponseDto(novoUsuario);
    }
    async onModuleInit() {
        const eventoSeedPath = path.join(process.cwd(), 'prisma', 'evento.seed.json');
        if (fs.existsSync(eventoSeedPath)) {
            const seedData = JSON.parse(fs.readFileSync(eventoSeedPath, 'utf8'));
            const evento = await this.eventoRepository.findFirst();
            if (!evento) {
                console.log('Semeadura Inicial: Criando Evento Padrão...');
                await this.eventoRepository.create(seedData);
            }
            else if (!evento.privateKey || !evento.publicKey) {
                await this.eventoRepository.update(evento.id, {
                    privateKey: seedData.privateKey,
                    publicKey: seedData.publicKey,
                });
            }
        }
        const adminExists = await this.usuarioRepository.findFirstAdmin();
        if (!adminExists) {
            const senhaPadrao = await bcrypt.hash('admin', 10);
            await this.usuarioRepository.create({
                login: 'admin',
                senhaHash: senhaPadrao,
                perfilAcesso: 'ADMIN',
            });
        }
        const scannerExists = await this.usuarioRepository.findByLogin('scanner');
        if (!scannerExists) {
            const senhaScanner = await bcrypt.hash('scanner', 10);
            await this.usuarioRepository.create({
                login: 'scanner',
                senhaHash: senhaScanner,
                perfilAcesso: 'LEITOR_CATRACA',
            });
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
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
    (0, common_1.Post)('register'),
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
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [usuario_repository_1.UsuarioRepository,
        evento_repository_1.EventoRepository,
        jwt_1.JwtService])
], AuthController);
//# sourceMappingURL=AuthController.js.map