// src/dtos/response/credenciado-response.dto.ts
import { TipoCategoria, TipoCombustivel } from '@prisma/client';

export class CredenciadoResponseDto {
  id: string;
  nomeCompleto: string;
  cpf: string;
  email: string;
  tipoCategoria: TipoCategoria;
  tipoCombustivel?: TipoCombustivel;
  endereco?: any;
  credencial?: any;
  descarbonizacao?: any;
  nomeEmpresa?: string;
  nomePropriedade?: string;
  nomeVeiculo?: string;

  constructor(partial: any) {
    this.id = partial.id;
    this.nomeCompleto = partial.nomeCompleto;
    this.cpf = partial.cpf;
    this.email = partial.email;
    this.tipoCategoria = partial.tipoCategoria;
    this.tipoCombustivel = partial.tipoCombustivel;
    this.nomeEmpresa = partial.nomeEmpresa;
    this.nomePropriedade = partial.nomePropriedade;
    this.nomeVeiculo = partial.nomeVeiculo;
    this.endereco = partial.endereco;
    this.descarbonizacao = partial.descarbonizacao;
    this.credencial = partial.credencial
      ? {
          ticketId: partial.credencial.ticketId,
          status: partial.credencial.status,
          qrToken: partial.credencial.qrToken,
        }
      : null;
  }
}
