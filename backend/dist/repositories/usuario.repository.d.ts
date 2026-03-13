import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IUsuarioOrganizacao } from '../domain/entities/usuario-organizacao.entity';
export declare class UsuarioRepository extends BaseRepository<IUsuarioOrganizacao, Prisma.UsuarioOrganizacaoCreateInput, Prisma.UsuarioOrganizacaoUpdateInput> {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService);
    findByLogin(login: string): Promise<IUsuarioOrganizacao | null>;
    findFirstAdmin(): Promise<IUsuarioOrganizacao | null>;
    findFirstUser(where: Prisma.UsuarioOrganizacaoWhereInput): Promise<IUsuarioOrganizacao | null>;
}
