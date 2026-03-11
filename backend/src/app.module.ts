import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { CredenciadosModule } from './credenciados/credenciados.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CredenciadosModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
