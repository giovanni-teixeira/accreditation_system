import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DataService {
  constructor(private readonly prisma: PrismaService) {}

  async listEventos() {
    return this.prisma.evento.findMany();
  }

  async listUsuariosOrganizacao() {
    return this.prisma.usuarioOrganizacao.findMany({
      select: {
        id: true,
        login: true,
        perfilAcesso: true,
        setor: true,
      },
    });
  }

  async listCredenciados() {
    return this.prisma.credenciado.findMany({
      include: {
        endereco: true,
        descarbonizacao: true,
        credencial: true,
      },
    });
  }

  async listEnderecos() {
    return this.prisma.endereco.findMany();
  }

  async listEnderecoCache() {
    return this.prisma.enderecoCache.findMany();
  }

  async listDescarbonizacao() {
    return this.prisma.descarbonizacao.findMany();
  }

  async listCredenciais() {
    return this.prisma.credencial.findMany();
  }

  async listQrScans() {
    return this.prisma.qrScan.findMany();
  }
}
