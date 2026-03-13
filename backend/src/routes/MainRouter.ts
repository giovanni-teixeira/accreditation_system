import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/AuthController';
import { CredenciadosController } from '../controllers/CredenciadosController';

@Module({
  controllers: [AuthController, CredenciadosController],
})
export class MainRouter {}
