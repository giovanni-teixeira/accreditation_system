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
const UsuariosController_1 = require("./controllers/UsuariosController");
const EventosController_1 = require("./controllers/EventosController");
const DescarbonizacaoController_1 = require("./controllers/DescarbonizacaoController");
const EnderecoCacheController_1 = require("./controllers/EnderecoCacheController");
const usuario_repository_1 = require("./repositories/usuario.repository");
const evento_repository_1 = require("./repositories/evento.repository");
const credenciado_repository_1 = require("./repositories/credenciado.repository");
const descarbonizacao_repository_1 = require("./repositories/descarbonizacao.repository");
const common_repository_1 = require("./repositories/common.repository");
const address_repository_1 = require("./repositories/address.repository");
const address_service_1 = require("./services/address.service");
const AddressController_1 = require("./controllers/AddressController");
const jwt_strategy_1 = require("./controllers/guards/jwt.strategy");
const ScansController_1 = require("./controllers/ScansController");
const scans_service_1 = require("./services/scans.service");
const qr_scan_repository_1 = require("./repositories/qr-scan.repository");
const credencial_repository_1 = require("./repositories/credencial.repository");
const logger_service_1 = require("./common/logger/logger.service");
const http_logger_middleware_1 = require("./common/middleware/http-logger.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(http_logger_middleware_1.HttpLoggerMiddleware).forRoutes('*');
    }
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
        controllers: [
            AuthController_1.AuthController,
            CredenciadosController_1.CredenciadosController,
            UsuariosController_1.UsuariosController,
            EventosController_1.EventosController,
            DescarbonizacaoController_1.DescarbonizacaoController,
            EnderecoCacheController_1.EnderecoCacheController,
            AddressController_1.AddressController,
            ScansController_1.ScansController,
        ],
        providers: [
            prisma_service_1.PrismaService,
            usuario_repository_1.UsuarioRepository,
            evento_repository_1.EventoRepository,
            credenciado_repository_1.CredenciadoRepository,
            descarbonizacao_repository_1.DescarbonizacaoRepository,
            common_repository_1.CommonRepository,
            address_repository_1.AddressRepository,
            address_service_1.AddressService,
            scans_service_1.ScansService,
            qr_scan_repository_1.QrScanRepository,
            credencial_repository_1.CredencialRepository,
            jwt_strategy_1.JwtStrategy,
            logger_service_1.AppLoggerService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map