import { CriarVisitanteDto } from './dto/criar-visitante.dto';
import { CriarCafeicultorDto } from './dto/criar-cafeicultor.dto';
import { CriarImprensaDto } from './dto/criar-imprensa.dto';
import { CriarExpositorDto } from './dto/criar-expositor.dto';
import { PrismaService } from '../prisma.service';
export declare class CredenciadosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private getEventoPadrao;
    private gerarCredencialAssinada;
    validarCpfUnico(cpf: string): Promise<void>;
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
    cadastrarVisitante(dto: CriarVisitanteDto): Promise<{
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
    cadastrarCafeicultor(dto: CriarCafeicultorDto): Promise<{
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
    cadastrarImprensa(dto: CriarImprensaDto): Promise<{
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
    cadastrarExpositor(dto: CriarExpositorDto): Promise<{
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
