import { TipoCategoria } from '@prisma/client';
import { ICredenciado } from '../../interfaces/credenciado.interface';
import { IEndereco } from '../../interfaces/endereco.interface';
import { ICredencial } from '../../interfaces/credencial.interface';
import { IDescarbonizacao } from '../../interfaces/descarbonizacao.interface';
export declare class CredenciadoResponseDto {
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
    constructor(partial: ICredenciado & {
        endereco?: IEndereco | null;
        credencial?: ICredencial | null;
        descarbonizacao?: IDescarbonizacao | null;
    });
}
