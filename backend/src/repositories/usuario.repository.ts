// src/repositories/usuario.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, UsuarioOrganizacao } from '@prisma/client';
import { BaseRepository } from './base.repository';

@Injectable()
export class UsuarioRepository extends BaseRepository<UsuarioOrganizacao, Prisma.UsuarioOrganizacaoCreateInput, Prisma.UsuarioOrganizacaoUpdateInput> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.usuarioOrganizacao);
  }

  async findByLogin(login: string) {
    return this.prisma.usuarioOrganizacao.findUnique({
      where: { login },
    });
  }

  async findFirstAdmin() {
    return this.prisma.usuarioOrganizacao.findFirst({
      where: { perfilAcesso: 'ADMIN' },
    });
  }

  async findFirstUser(where: Prisma.UsuarioOrganizacaoWhereInput) {
    return this.prisma.usuarioOrganizacao.findFirst({ where });
  }
}
