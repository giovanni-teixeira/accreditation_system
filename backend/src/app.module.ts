import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from './prisma.service';
import { AuthController } from './controllers/AuthController';
import { CredenciadosController } from './controllers/CredenciadosController';
import { UsuariosController } from './controllers/UsuariosController';
import { EventosController } from './controllers/EventosController';
import { DescarbonizacaoController } from './controllers/DescarbonizacaoController';
import { EnderecoCacheController } from './controllers/EnderecoCacheController';
import { UsuarioRepository } from './repositories/usuario.repository';
import { EventoRepository } from './repositories/evento.repository';
import { CredenciadoRepository } from './repositories/credenciado.repository';
import { DescarbonizacaoRepository } from './repositories/descarbonizacao.repository';
import { CommonRepository } from './repositories/common.repository';
import { AddressRepository } from './repositories/address.repository';
import { AddressService } from './services/address.service';
import { AddressController } from './controllers/AddressController';
import { JwtStrategy } from './controllers/guards/jwt.strategy';
import { ScansController } from './controllers/ScansController';
import { ScansService } from './services/scans.service';
import { QrScanRepository } from './repositories/qr-scan.repository';
import { CredencialRepository as CredRepo } from './repositories/credencial.repository';
import { AppLoggerService } from './common/logger/logger.service';
import { HttpLoggerMiddleware } from './common/middleware/http-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jwt-alta-cafe-secret-key-super-secure',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [
    AuthController,
    CredenciadosController,
    UsuariosController,
    EventosController,
    DescarbonizacaoController,
    EnderecoCacheController,
    AddressController,
    ScansController,
  ],
  providers: [
    PrismaService,
    UsuarioRepository,
    EventoRepository,
    CredenciadoRepository,
    DescarbonizacaoRepository,
    CommonRepository,
    AddressRepository,
    AddressService,
    ScansService,
    QrScanRepository,
    CredRepo,
    JwtStrategy,
    AppLoggerService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
