import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dtos/request/login.dto';
import { RegisterDto } from '../dtos/request/register.dto';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { EventoRepository } from '../repositories/evento.repository';
import { UsuarioResponseDto } from '../dtos/response/usuario-response.dto';
export declare class AuthController implements OnModuleInit {
    private readonly usuarioRepository;
    private readonly eventoRepository;
    private readonly jwtService;
    constructor(usuarioRepository: UsuarioRepository, eventoRepository: EventoRepository, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        publicKey: string | null;
        user: UsuarioResponseDto;
    }>;
    register(registerDto: RegisterDto): Promise<UsuarioResponseDto>;
    onModuleInit(): Promise<void>;
}
