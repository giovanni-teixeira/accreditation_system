import { CredenciadosService } from './credenciados.service';
import { CriarVisitanteDto } from './dto/criar-visitante.dto';
import { CriarCafeicultorDto } from './dto/criar-cafeicultor.dto';
import { CriarImprensaDto } from './dto/criar-imprensa.dto';
import { CriarExpositorDto } from './dto/criar-expositor.dto';
export declare class CredenciadosController {
    private readonly credenciadosService;
    constructor(credenciadosService: CredenciadosService);
    cadastrarVisitante(criarVisitanteDto: CriarVisitanteDto): Promise<{
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
