// src/dtos/response/credenciado-response.dto.ts
import { TipoCategoria, TipoCombustivel } from '@prisma/client';
import { ICredenciado } from '../../interfaces/credenciado.interface';
import { IEndereco } from '../../interfaces/endereco.interface';
import { ICredencial } from '../../interfaces/credencial.interface';
import { IDescarbonizacao } from '../../interfaces/descarbonizacao.interface';

export class CredenciadoResponseDto {
  id: string;
  nomeCompleto: string;
  cpf: string;
  email: string;
  tipoCategoria: TipoCategoria;
  endereco?: IEndereco | null;
  credencial?: Pick<ICredencial, 'ticketId' | 'status' | 'qrToken'> | null;
  descarbonizacao?: IDescarbonizacao | null;
  nomeEmpresa?: string;
  nomePropriedade?: string;
  nomeVeiculo?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: ICredenciado & {
    endereco?: IEndereco | null;
    credencial?: ICredencial | null;
    descarbonizacao?: IDescarbonizacao | null;
  }) {
    this.id = partial.id;
    this.nomeCompleto = partial.nomeCompleto;
    this.cpf = partial.cpf;
    this.email = partial.email;
    this.tipoCategoria = partial.tipoCategoria;
    this.nomeEmpresa = partial.nomeEmpresa;
    this.nomePropriedade = partial.nomePropriedade;
    this.nomeVeiculo = partial.nomeVeiculo;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
    this.endereco = partial.endereco ?? null;
    this.descarbonizacao = partial.descarbonizacao ?? null;
    this.credencial = partial.credencial
      ? {
          ticketId: partial.credencial.ticketId,
          status: partial.credencial.status,
          qrToken: partial.credencial.qrToken,
        }
      : null;
  }
}
