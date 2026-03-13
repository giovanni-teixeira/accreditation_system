import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoginDto } from '../dtos/request/login.dto';
import { RegisterDto } from '../dtos/request/register.dto';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { EventoRepository } from '../repositories/evento.repository';
import { UsuarioResponseDto } from '../dtos/response/usuario-response.dto';
// Nota: Os Guards e Decorators serão movidos em breve, por enquanto mantemos o import corrigido se necessário
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

import { ROUTES } from '../routes/routes.constants';

@ApiTags('autenticacao')
@Controller(ROUTES.AUTH.BASE)
export class AuthController implements OnModuleInit {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly eventoRepository: EventoRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  @Post(ROUTES.AUTH.LOGIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logar no sistema (Retorna JWT e PublicKey se for Scanner)',
  })
  @ApiResponse({ status: 200, description: 'Logado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.usuarioRepository.findByLogin(loginDto.login);
    if (!user || !(await bcrypt.compare(loginDto.senhaHash, user.senhaHash))) {
      throw new UnauthorizedException('Credenciais inválidas');
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
      user: new UsuarioResponseDto(user),
    };
  }

  @Post(ROUTES.AUTH.REGISTER)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar novo usuário na organização (Apenas ADMIN)' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso.' })
  async register(@Body() registerDto: RegisterDto) {
    const saltRounds = 10;
    const hashData = await bcrypt.hash(registerDto.senhaPura, saltRounds);

    const novoUsuario = await this.usuarioRepository.create({
      login: registerDto.login,
      senhaHash: hashData,
      perfilAcesso: registerDto.perfilAcesso,
    });

    return new UsuarioResponseDto(novoUsuario);
  }

  async onModuleInit() {
    const eventoSeedPath = path.join(
      process.cwd(),
      'prisma',
      'evento.seed.json',
    );
    if (fs.existsSync(eventoSeedPath)) {
      const seedData = JSON.parse(fs.readFileSync(eventoSeedPath, 'utf8'));

      const evento = await this.eventoRepository.findFirst();
      if (!evento) {
        console.log('Semeadura Inicial: Criando Evento Padrão...');
        await this.eventoRepository.create(seedData);
      } else if (!evento.privateKey || !evento.publicKey) {
        await this.eventoRepository.update(evento.id, {
          privateKey: seedData.privateKey,
          publicKey: seedData.publicKey,
        });
      }
    }

    const adminLogin = this.configService.get<string>('ADMIN_LOGIN');
    if (adminLogin) {
      const adminExists = await this.usuarioRepository.findByLogin(adminLogin);
      if (!adminExists) {
        console.log(`Gerando Usuário Admin: ${adminLogin}...`);
        const password = this.configService.get<string>('ADMIN_PASSWORD');
        const hash = await bcrypt.hash(password || 'admin123', 10);
        await this.usuarioRepository.create({
          login: adminLogin,
          senhaHash: hash,
          perfilAcesso: 'ADMIN',
          nomeCompleto: this.configService.get<string>('ADMIN_NAME'),
          email: this.configService.get<string>('ADMIN_EMAIL'),
        });
      }
    }

    const scannerLogin = this.configService.get<string>('SCANNER_LOGIN');
    if (scannerLogin) {
      const scannerExists = await this.usuarioRepository.findByLogin(scannerLogin);
      if (!scannerExists) {
        console.log(`Gerando Usuário Scanner: ${scannerLogin}...`);
        const password = this.configService.get<string>('SCANNER_PASSWORD');
        const hash = await bcrypt.hash(password || 'scanner123', 10);
        await this.usuarioRepository.create({
          login: scannerLogin,
          senhaHash: hash,
          perfilAcesso: 'LEITOR_CATRACA',
          nomeCompleto: this.configService.get<string>('SCANNER_NAME'),
        });
      }
    }
  }
}
