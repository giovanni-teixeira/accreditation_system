// src/dtos/response/credenciado-response.dto.ts
import { TipoCategoria, TipoCombustivel } from '@prisma/client';

export class CredenciadoResponseDto {
  id: string;
  nomeCompleto: string;
  cpf: string;
  email: string;
  tipoCategoria: TipoCategoria;
  tipoCombustivel: TipoCombustivel;
  endereco?: any;
  credencial?: any;
  nomeEmpresa?: string;

  constructor(partial: any) {
    this.id = partial.id;
    this.nomeCompleto = partial.nomeCompleto;
    this.cpf = partial.cpf;
    this.email = partial.email;
    this.tipoCategoria = partial.tipoCategoria;
    this.tipoCombustivel = partial.tipoCombustivel;
    this.nomeEmpresa = partial.nomeEmpresa;
    this.endereco = partial.endereco;
    this.credencial = partial.credencial
      ? {
        ticketId: partial.credencial.ticketId,
        status: partial.credencial.status,
        qrToken: partial.credencial.qrToken, // Retornamos apenas o necessário
      }
      : null;
  }
}
