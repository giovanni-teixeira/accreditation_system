import { Injectable, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PerfilAcesso } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService implements OnModuleInit {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(login: string, pass: string): Promise<any> {
        const user = await this.prisma.usuarioOrganizacao.findUnique({ where: { login } });
        if (user && await bcrypt.compare(pass, user.senhaHash)) {
            const { senhaHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.login, loginDto.senhaHash);
        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = { sub: user.id, login: user.login, role: user.perfilAcesso };
        const access_token = this.jwtService.sign(payload);

        let publicKey = null;
        if (user.perfilAcesso === 'LEITOR_CATRACA') {
            const evento = await this.prisma.evento.findFirst();
            if (evento && evento.publicKey) {
                publicKey = evento.publicKey;
            }
        }

        return {
            access_token,
            publicKey,
            user: {
                id: user.id,
                login: user.login,
                role: user.perfilAcesso
            }
        };
    }

    async register(registerDto: RegisterDto) {
        const saltRounds = 10;
        const hashData = await bcrypt.hash(registerDto.senhaPura, saltRounds);

        const novoUsuario = await this.prisma.usuarioOrganizacao.create({
            data: {
                login: registerDto.login,
                senhaHash: hashData,
                perfilAcesso: registerDto.perfilAcesso
            }
        });

        const { senhaHash, ...result } = novoUsuario;
        return result;
    }

    async onModuleInit() {
        const eventoSeedPath = path.join(process.cwd(), 'prisma', 'evento.seed.json');
        if (fs.existsSync(eventoSeedPath)) {
            const seedData = JSON.parse(fs.readFileSync(eventoSeedPath, 'utf8'));

            let evento = await this.prisma.evento.findFirst();
            if (!evento) {
                console.log('Semeadura Inicial: Criando Evento Padrão e inserindo Chaves Criptográficas estáticas...');
                await this.prisma.evento.create({ data: seedData });
            } else if (!evento.privateKey || !evento.publicKey) {
                console.log('Semeadura Inicial: Atualizando Evento Padrão com Chaves Criptográficas...');
                await this.prisma.evento.update({
                    where: { id: evento.id },
                    data: {
                        privateKey: seedData.privateKey,
                        publicKey: seedData.publicKey
                    }
                });
            }
        }

        const adminExists = await this.prisma.usuarioOrganizacao.findFirst({
            where: { perfilAcesso: 'ADMIN' }
        });

        if (!adminExists) {
            console.log('Semeadura Inicial: Criando usuário ADMIN padrão (login: admin, senha: admin)');
            const senhaPadrao = await bcrypt.hash('admin', 10);
            await this.prisma.usuarioOrganizacao.create({
                data: {
                    login: 'admin',
                    senhaHash: senhaPadrao,
                    perfilAcesso: 'ADMIN'
                }
            });
        }

        const scannerExists = await this.prisma.usuarioOrganizacao.findFirst({
            where: { login: 'scanner' }
        });

        if (!scannerExists) {
            console.log('Semeadura Inicial: Criando usuário LEITOR_CATRACA padrão (login: scanner, senha: scanner)');
            const senhaScanner = await bcrypt.hash('scanner', 10);
            await this.prisma.usuarioOrganizacao.create({
                data: {
                    login: 'scanner',
                    senhaHash: senhaScanner,
                    perfilAcesso: 'LEITOR_CATRACA'
                }
            });
        }
    }
}
