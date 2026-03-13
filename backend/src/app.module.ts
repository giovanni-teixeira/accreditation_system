import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from './prisma.service';
import { AuthController } from './controllers/AuthController';
import { CredenciadosController } from './controllers/CredenciadosController';
import { UsuarioRepository } from './repositories/usuario.repository';
import { EventoRepository } from './repositories/evento.repository';
import { CredenciadoRepository } from './repositories/credenciado.repository';
import { CommonRepository } from './repositories/common.repository';
import { JwtStrategy } from './controllers/guards/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jwt-alta-cafe-secret-key-super-secure',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController, CredenciadosController],
  providers: [
    PrismaService,
    UsuarioRepository,
    EventoRepository,
    CredenciadoRepository,
    CommonRepository,
    JwtStrategy,
  ],
})
export class AppModule { }
