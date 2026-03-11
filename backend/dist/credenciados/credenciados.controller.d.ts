import { CredenciadosService } from './credenciados.service';
import { CriarVisitanteDto } from './dto/criar-visitante.dto';
import { CriarCafeicultorDto } from './dto/criar-cafeicultor.dto';
import { CriarImprensaDto } from './dto/criar-imprensa.dto';
import { CriarExpositorDto } from './dto/criar-expositor.dto';
export declare class CredenciadosController {
    private readonly credenciadosService;
    constructor(credenciadosService: CredenciadosService);
    cadastrarVisitante(criarVisitanteDto: CriarVisitanteDto): Promise<{
        endereco: {
            cep: string;
            rua: string;
            bairro: string;
            cidade: string;
            estado: string;
            id: string;
            credenciadoId: string;
        } | null;
        credencial: {
            id: string;
            ticketId: string;
            qrToken: string;
            downloads: number;
            printCount: number;
            status: string;
            createdAt: Date;
            credenciadoId: string;
        } | null;
    } & {
        nomeCompleto: string;
        cpf: string;
        rg: string;
        celular: string;
        email: string;
        aceiteLgpd: boolean;
        tipoCombustivel: import(".prisma/client").$Enums.TipoCombustivel;
        ccir: string | null;
        cnpj: string | null;
        id: string;
        eventoId: string;
        tipoCategoria: import(".prisma/client").$Enums.TipoCategoria;
    }>;
    cadastrarCafeicultor(criarCafeicultorDto: CriarCafeicultorDto): Promise<{
        endereco: {
            cep: string;
            rua: string;
            bairro: string;
            cidade: string;
            estado: string;
            id: string;
            credenciadoId: string;
        } | null;
        credencial: {
            id: string;
            ticketId: string;
            qrToken: string;
            downloads: number;
            printCount: number;
            status: string;
            createdAt: Date;
            credenciadoId: string;
        } | null;
    } & {
        nomeCompleto: string;
        cpf: string;
        rg: string;
        celular: string;
        email: string;
        aceiteLgpd: boolean;
        tipoCombustivel: import(".prisma/client").$Enums.TipoCombustivel;
        ccir: string | null;
        cnpj: string | null;
        id: string;
        eventoId: string;
        tipoCategoria: import(".prisma/client").$Enums.TipoCategoria;
    }>;
    cadastrarImprensa(criarImprensaDto: CriarImprensaDto): Promise<{
        endereco: {
            cep: string;
            rua: string;
            bairro: string;
            cidade: string;
            estado: string;
            id: string;
            credenciadoId: string;
        } | null;
        credencial: {
            id: string;
            ticketId: string;
            qrToken: string;
            downloads: number;
            printCount: number;
            status: string;
            createdAt: Date;
            credenciadoId: string;
        } | null;
    } & {
        nomeCompleto: string;
        cpf: string;
        rg: string;
        celular: string;
        email: string;
        aceiteLgpd: boolean;
        tipoCombustivel: import(".prisma/client").$Enums.TipoCombustivel;
        ccir: string | null;
        cnpj: string | null;
        id: string;
        eventoId: string;
        tipoCategoria: import(".prisma/client").$Enums.TipoCategoria;
    }>;
    cadastrarExpositor(criarExpositorDto: CriarExpositorDto): Promise<{
        endereco: {
            cep: string;
            rua: string;
            bairro: string;
            cidade: string;
            estado: string;
            id: string;
            credenciadoId: string;
        } | null;
        credencial: {
            id: string;
            ticketId: string;
            qrToken: string;
            downloads: number;
            printCount: number;
            status: string;
            createdAt: Date;
            credenciadoId: string;
        } | null;
    } & {
        nomeCompleto: string;
        cpf: string;
        rg: string;
        celular: string;
        email: string;
        aceiteLgpd: boolean;
        tipoCombustivel: import(".prisma/client").$Enums.TipoCombustivel;
        ccir: string | null;
        cnpj: string | null;
        id: string;
        eventoId: string;
        tipoCategoria: import(".prisma/client").$Enums.TipoCategoria;
    }>;
    buscarPorCpf(cpf: string): Promise<{
        endereco: {
            cep: string;
            rua: string;
            bairro: string;
            cidade: string;
            estado: string;
            id: string;
            credenciadoId: string;
        } | null;
        credencial: {
            id: string;
            ticketId: string;
            qrToken: string;
            downloads: number;
            printCount: number;
            status: string;
            createdAt: Date;
            credenciadoId: string;
        } | null;
    } & {
        nomeCompleto: string;
        cpf: string;
        rg: string;
        celular: string;
        email: string;
        aceiteLgpd: boolean;
        tipoCombustivel: import(".prisma/client").$Enums.TipoCombustivel;
        ccir: string | null;
        cnpj: string | null;
        id: string;
        eventoId: string;
        tipoCategoria: import(".prisma/client").$Enums.TipoCategoria;
    }>;
}
