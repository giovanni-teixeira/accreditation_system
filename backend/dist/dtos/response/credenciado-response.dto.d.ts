import { TipoCategoria, TipoCombustivel } from '@prisma/client';
import { IEndereco, ICredencial, IDescarbonizacao, ICredenciado } from '../../interfaces';
export declare class CredenciadoResponseDto {
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
    constructor(partial: ICredenciado & {
        endereco?: IEndereco | null;
        credencial?: ICredencial | null;
        descarbonizacao?: IDescarbonizacao | null;
    });
}
