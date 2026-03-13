"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const prisma_service_1 = require("./prisma.service");
const AuthController_1 = require("./controllers/AuthController");
const CredenciadosController_1 = require("./controllers/CredenciadosController");
const usuario_repository_1 = require("./repositories/usuario.repository");
const evento_repository_1 = require("./repositories/evento.repository");
const credenciado_repository_1 = require("./repositories/credenciado.repository");
const common_repository_1 = require("./repositories/common.repository");
const jwt_strategy_1 = require("./controllers/guards/jwt.strategy");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'jwt-alta-cafe-secret-key-super-secure',
                signOptions: { expiresIn: '24h' },
            }),
        ],
        controllers: [AuthController_1.AuthController, CredenciadosController_1.CredenciadosController],
        providers: [
            prisma_service_1.PrismaService,
            usuario_repository_1.UsuarioRepository,
            evento_repository_1.EventoRepository,
            credenciado_repository_1.CredenciadoRepository,
            common_repository_1.CommonRepository,
            jwt_strategy_1.JwtStrategy,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map