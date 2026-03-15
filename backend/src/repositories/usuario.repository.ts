// src/repositories/usuario.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, UsuarioOrganizacao as PrismaUsuario } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IUsuarioOrganizacao } from '../interfaces/usuario-organizacao.interface';

@Injectable()
export class UsuarioRepository extends BaseRepository<
  IUsuarioOrganizacao,
  Prisma.UsuarioOrganizacaoCreateInput,
  Prisma.UsuarioOrganizacaoUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.usuarioOrganizacao);
  }

  async findByLogin(login: string): Promise<IUsuarioOrganizacao | null> {
    const result = await this.prisma.usuarioOrganizacao.findUnique({
      where: { login },
    });

    return result as IUsuarioOrganizacao | null;
  }

  async findFirstAdmin(): Promise<IUsuarioOrganizacao | null> {
    const result = await this.prisma.usuarioOrganizacao.findFirst({
      where: { perfilAcesso: 'ADMIN' },
    });

    return result as IUsuarioOrganizacao | null;
  }

  async findFirstUser(
    where: Prisma.UsuarioOrganizacaoWhereInput,
  ): Promise<IUsuarioOrganizacao | null> {
    const result = await this.prisma.usuarioOrganizacao.findFirst({ where });

    return result as IUsuarioOrganizacao | null;
  }
}

