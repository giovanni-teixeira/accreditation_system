import { TipoCategoria, TipoCombustivel } from '@prisma/client';
import {
  IEndereco,
  ICredencial,
  IDescarbonizacao,
  ICredenciado,
} from '../../interfaces';

export class CredenciadoResponseDto {
  id: string;
  nomeCompleto: string;
  cpf: string;
  email: string;
  tipoCategoria: TipoCategoria;
  tipoCombustivel?: TipoCombustivel;
  endereco?: IEndereco | null;
  credencial?: Partial<ICredencial> | null;
  descarbonizacao?: IDescarbonizacao | null;
  nomeEmpresa?: string;

  constructor(
    partial: ICredenciado & {
      endereco?: IEndereco | null;
      credencial?: ICredencial | null;
      descarbonizacao?: IDescarbonizacao | null;
    },
  ) {
    this.id = partial.id;
    this.nomeCompleto = partial.nomeCompleto;
    this.cpf = partial.cpf;
    this.email = partial.email;
    this.tipoCategoria = partial.tipoCategoria as TipoCategoria;
    this.nomeEmpresa = partial.nomeEmpresa;
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
