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
import { QrCodeHelper } from '../utils/qrcode.util';
import { BusinessException } from '../common/exceptions/business.exception';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoginDto } from '../dtos/request/login.dto';
import { RegisterDto } from '../dtos/request/register.dto';
import { PromoverCredenciadoDto } from '../dtos/request/promover-credenciado.dto';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { EventoRepository } from '../repositories/evento.repository';
import { CredenciadoRepository } from '../repositories/credenciado.repository';
import { UsuarioResponseDto } from '../dtos/response/usuario-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

import { ROUTES } from '../routes/routes.constants';
import { AppLoggerService } from '../common/logger/logger.service';

@ApiTags('autenticacao')
@Controller(ROUTES.AUTH.BASE)
export class AuthController implements OnModuleInit {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly eventoRepository: EventoRepository,
    private readonly credenciadoRepository: CredenciadoRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: AppLoggerService,
  ) {}

  @Post(ROUTES.AUTH.LOGIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logar no sistema (Retorna JWT e PublicKey se for Scanner)',
  })
  @ApiResponse({ status: 200, description: 'Logado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.usuarioRepository.findByLogin(loginDto.login);
      if (
        !user ||
        !(await bcrypt.compare(loginDto.senhaHash, user.senhaHash))
      ) {
        this.logger.warn(`Tentativa de login inválida para o usuário: ${loginDto.login}`, 'Auth');
        throw new BusinessException(
          'Usuário ou senha inválidos. Por favor, verifique suas credenciais.',
          401,
        );
      }

      this.logger.log(`Login realizado com sucesso: ${user.login} (Perfil: ${user.perfilAcesso})`, 'Auth');

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
    } catch (error) {
      if (error instanceof BusinessException) throw error;
      throw new BusinessException(`Falha na autenticação: ${error.message}`);
    }
  }

  @Post(ROUTES.AUTH.REGISTER)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar novo usuário na organização com credencial completa (Apenas ADMIN)' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso.' })
  async register(@Body() registerDto: RegisterDto) {
    try {
      const saltRounds = 10;
      const hashData = await bcrypt.hash(registerDto.senhaPura, saltRounds);

      // 1. Criar login do usuário
      const novoUsuario = await this.usuarioRepository.create({
        login: registerDto.login,
        senhaHash: hashData,
        perfilAcesso: registerDto.perfilAcesso,
        setor: registerDto.setor,
      });

      this.logger.log(`Novo usuário registrado: ${novoUsuario.login} (Perfil: ${novoUsuario.perfilAcesso})`, 'Auth');

      // 2. Se CPF foi fornecido, criar Credenciado + Credencial (QR) + Descarbonizacao
      if (registerDto.cpf) {
        const evento = await this.eventoRepository.findFirst();
        const credExists = await this.credenciadoRepository.findByCpf(registerDto.cpf);

        if (!credExists && evento) {
          const nomeCompleto = registerDto.nomeCompleto || registerDto.login.toUpperCase();
          const tokenDados = QrCodeHelper.generateSignedToken(
            evento.id,
            evento.privateKey!,
            nomeCompleto,
          );

          await this.credenciadoRepository.create(
            {
              nomeCompleto,
              cpf: registerDto.cpf,
              rg: registerDto.rg ?? null,
              celular: registerDto.celular ?? '00000000000',
              email: registerDto.email ?? `${registerDto.login}@sistema.com`,
              tipoCategoria: 'ORGANIZACAO',
              aceiteLgpd: true,
              evento: { connect: { id: evento.id } },
              descarbonizacao: {
                create: {
                  distanciaIdaVoltaKm: 0,
                  tipoCombustivel: 'GASOLINA',
                  pegadaCo2: 0,
                },
              },
              credencial: {
                create: {
                  ticketId: tokenDados.ticketId,
                  qrToken: tokenDados.qrToken,
                  status: 'ACTIVE',
                },
              },
            },
            { credencial: true },
          );
        }
      }

      return new UsuarioResponseDto(novoUsuario);
    } catch (error) {
      if (error instanceof BusinessException) throw error;
      throw new BusinessException(
        `Erro ao registrar usuário: ${error.message}`,
      );
    }
  }
  @Post(ROUTES.AUTH.PROMOVER)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Promover credenciado existente a ADMIN ou LEITOR_CATRACA (apenas ADMIN)',
    description:
      'Busca um credenciado pelo CPF e cria um login de acesso para ele. ' +
      'Não duplica registros — se o credenciado já existe, apenas cria o usuário.',
  })
  @ApiResponse({ status: 201, description: 'Usuário criado e vinculado ao credenciado com sucesso.' })
  @ApiResponse({ status: 404, description: 'CPF não encontrado nos credenciados.' })
  @ApiResponse({ status: 409, description: 'Login já existe no sistema.' })
  async promover(@Body() dto: PromoverCredenciadoDto) {
    try {
      // 1. Verificar se o credenciado existe pelo CPF
      const credenciado = await this.credenciadoRepository.findByCpf(dto.cpf);
      if (!credenciado) {
        throw new BusinessException(
          `CPF ${dto.cpf} não encontrado nos credenciados. Cadastre a pessoa primeiro.`,
          404,
        );
      }

      // 2. Verificar se o login já existe
      const loginExiste = await this.usuarioRepository.findByLogin(dto.login);
      if (loginExiste) {
        throw new BusinessException(
          `O login '${dto.login}' já está em uso. Escolha outro.`,
          409,
        );
      }

      // 3. Criar apenas o usuário (credenciado já existe, sem duplicar)
      const hash = await bcrypt.hash(dto.senhaPura, 10);
      const novoUsuario = await this.usuarioRepository.create({
        login: dto.login,
        senhaHash: hash,
        perfilAcesso: dto.perfilAcesso,
        setor: dto.setor,
      });

      this.logger.log(`Credenciado promovido a usuário: ${novoUsuario.login} (Perfil: ${novoUsuario.perfilAcesso})`, 'Auth');

      return {
        ...new UsuarioResponseDto(novoUsuario),
        credenciado: {
          id: credenciado.id,
          nomeCompleto: credenciado.nomeCompleto,
          cpf: credenciado.cpf,
          tipoCategoria: credenciado.tipoCategoria,
        },
        mensagem: `Usuário '${dto.login}' criado com perfil ${dto.perfilAcesso} e vinculado ao credenciado '${credenciado.nomeCompleto}'.`,
      };
    } catch (error) {
      if (error instanceof BusinessException) throw error;
      throw new BusinessException(`Erro ao promover credenciado: ${error.message}`);
    }
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
        await this.eventoRepository.create({
          ...seedData,
          localEvento: 'Clube de Campo, Franca, SP',
          latitude: -20.651167,
          longitude: -47.477722,
        });
      } else if (
        !evento.privateKey ||
        !evento.publicKey ||
        !evento.latitude ||
        !evento.localEvento
      ) {
        await this.eventoRepository.update(evento.id, {
          privateKey: seedData.privateKey,
          publicKey: seedData.publicKey,
          localEvento: 'Clube de Campo, Franca, SP',
          latitude: -20.651167,
          longitude: -47.477722,
        });
      }
    }

    // --- SEED ADMIN ---
    const adminLogin = this.configService.get<string>('ADMIN_LOGIN');
    if (adminLogin) {
      const adminExists = await this.usuarioRepository.findByLogin(adminLogin);
      if (!adminExists) {
        console.log(`Gerando Usuário Admin: ${adminLogin}...`);
        const password = this.configService.get<string>('ADMIN_PASSWORD');
        const hash = await bcrypt.hash(password || 'admin123', 10);

        // 1. Criar Login
        await this.usuarioRepository.create({
          login: adminLogin,
          senhaHash: hash,
          perfilAcesso: 'ADMIN',
          setor: 'ADMINISTRAÇÃO',
        });

        // 2. Criar Identidade (Credenciado) + Credencial (QR)
        const evento = await this.eventoRepository.findFirst();
        const adminCpf =
          this.configService.get<string>('ADMIN_CPF') || '00000000000';
        const adminName =
          this.configService.get<string>('ADMIN_NAME') || 'ADMINISTRADOR';

        const credExists = await this.credenciadoRepository.findByCpf(adminCpf);
        if (!credExists && evento) {
          const tokenDados = QrCodeHelper.generateSignedToken(
            evento.id,
            evento.privateKey!,
            adminName,
          );
          await this.credenciadoRepository.create({
            nomeCompleto: adminName,
            cpf: adminCpf,
            rg: '00000000',
            celular: '00000000000',
            email:
              this.configService.get<string>('ADMIN_EMAIL') ||
              'admin@sistema.com',
            tipoCategoria: 'ORGANIZACAO',
            aceiteLgpd: true,
            evento: { connect: { id: evento.id } },
            descarbonizacao: {
              create: {
                distanciaIdaVoltaKm: 0,
                tipoCombustivel: 'GASOLINA',
                pegadaCo2: 0,
              },
            },
            credencial: {
              create: {
                ticketId: tokenDados.ticketId,
                qrToken: tokenDados.qrToken,
                status: 'ACTIVE',
              },
            },
          });
          console.log(`Credencial do Admin gerada com sucesso.`);
        }
      }
    }

    // --- SEED SCANNER ---
    const scannerLogin = this.configService.get<string>('SCANNER_LOGIN');
    if (scannerLogin) {
      const scannerExists =
        await this.usuarioRepository.findByLogin(scannerLogin);
      if (!scannerExists) {
        console.log(`Gerando Usuário Scanner: ${scannerLogin}...`);
        const password = this.configService.get<string>('SCANNER_PASSWORD');
        const hash = await bcrypt.hash(password || 'scanner123', 10);

        // 1. Criar Login
        await this.usuarioRepository.create({
          login: scannerLogin,
          senhaHash: hash,
          perfilAcesso: 'LEITOR_CATRACA',
          setor: 'PORTARIA',
        });

        // 2. Criar Identidade (Credenciado) + Credencial (QR)
        const evento = await this.eventoRepository.findFirst();
        const scannerCpf =
          this.configService.get<string>('SCANNER_CPF') || '11111111111';
        const scannerName =
          this.configService.get<string>('SCANNER_NAME') || 'LEITOR CATRACA';

        const credExists =
          await this.credenciadoRepository.findByCpf(scannerCpf);
        if (!credExists && evento) {
          const tokenDados = QrCodeHelper.generateSignedToken(
            evento.id,
            evento.privateKey!,
            scannerName,
          );
          await this.credenciadoRepository.create({
            nomeCompleto: scannerName,
            cpf: scannerCpf,
            rg: '11111111',
            celular: '11111111111',
            email: 'scanner@sistema.com',
            tipoCategoria: 'ORGANIZACAO',
            aceiteLgpd: true,
            evento: { connect: { id: evento.id } },
            descarbonizacao: {
              create: {
                distanciaIdaVoltaKm: 0,
                tipoCombustivel: 'GASOLINA',
                pegadaCo2: 0,
              },
            },
            credencial: {
              create: {
                ticketId: tokenDados.ticketId,
                qrToken: tokenDados.qrToken,
                status: 'ACTIVE',
              },
            },
          });
          console.log(`Credencial do Scanner gerada com sucesso.`);
        }
      }
    }
  }
}
