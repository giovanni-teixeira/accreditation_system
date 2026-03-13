import { PrismaService } from '../prisma.service';
import { Prisma, UsuarioOrganizacao } from '@prisma/client';
import { BaseRepository } from './base.repository';
export declare class UsuarioRepository extends BaseRepository<UsuarioOrganizacao, Prisma.UsuarioOrganizacaoCreateInput, Prisma.UsuarioOrganizacaoUpdateInput> {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService);
    findByLogin(login: string): Promise<{
        login: string;
        senhaHash: string;
        perfilAcesso: import(".prisma/client").$Enums.PerfilAcesso;
        id: string;
    } | null>;
    findFirstAdmin(): Promise<{
        login: string;
        senhaHash: string;
        perfilAcesso: import(".prisma/client").$Enums.PerfilAcesso;
        id: string;
    } | null>;
    findFirstUser(where: Prisma.UsuarioOrganizacaoWhereInput): Promise<{
        login: string;
        senhaHash: string;
        perfilAcesso: import(".prisma/client").$Enums.PerfilAcesso;
        id: string;
    } | null>;
}
