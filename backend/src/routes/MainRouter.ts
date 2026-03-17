import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/AuthController';
import { CredenciadosController } from '../controllers/CredenciadosController';
import { ScansController } from '../controllers/ScansController';

@Module({
  controllers: [AuthController, CredenciadosController, ScansController],
})
export class MainRouter {}
