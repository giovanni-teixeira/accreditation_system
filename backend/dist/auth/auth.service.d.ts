import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService implements OnModuleInit {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(login: string, pass: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        publicKey: string | null;
        user: {
            id: any;
            login: any;
            role: any;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        id: string;
        login: string;
        perfilAcesso: import(".prisma/client").$Enums.PerfilAcesso;
    }>;
    onModuleInit(): Promise<void>;
}
