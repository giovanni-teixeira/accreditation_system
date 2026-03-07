import { Module } from '@nestjs/common';
import { CredenciadosService } from './credenciados.service';
import { CredenciadosController } from './credenciados.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CredenciadosController],
  providers: [CredenciadosService, PrismaService],
})
export class CredenciadosModule { }
