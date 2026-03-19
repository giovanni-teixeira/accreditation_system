import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '../dtos/request/login.dto';
import { RegisterDto } from '../dtos/request/register.dto';
import { PromoverCredenciadoDto } from '../dtos/request/promover-credenciado.dto';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { EventoRepository } from '../repositories/evento.repository';
import { CredenciadoRepository } from '../repositories/credenciado.repository';
import { UsuarioResponseDto } from '../dtos/response/usuario-response.dto';
export declare class AuthController implements OnModuleInit {
    private readonly usuarioRepository;
    private readonly eventoRepository;
    private readonly credenciadoRepository;
    private readonly jwtService;
    private readonly configService;
    constructor(usuarioRepository: UsuarioRepository, eventoRepository: EventoRepository, credenciadoRepository: CredenciadoRepository, jwtService: JwtService, configService: ConfigService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        publicKey: string | null;
        user: UsuarioResponseDto;
    }>;
    register(registerDto: RegisterDto): Promise<UsuarioResponseDto>;
    promover(dto: PromoverCredenciadoDto): Promise<{
        credenciado: {
            id: string;
            nomeCompleto: string;
            cpf: string;
            tipoCategoria: import("../interfaces/credenciado.interface").TipoCategoria;
        };
        mensagem: string;
        id: string;
        login: string;
        perfilAcesso: import(".prisma/client").PerfilAcesso;
    }>;
    onModuleInit(): Promise<void>;
}
