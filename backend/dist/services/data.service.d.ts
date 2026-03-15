import { PrismaService } from '../prisma.service';
export declare class DataService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listEventos(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nomeEvento: string;
        isGratuito: boolean;
        localEvento: string | null;
        latitude: number | null;
        longitude: number | null;
        privateKey: string | null;
        publicKey: string | null;
    }[]>;
    listUsuariosOrganizacao(): Promise<{
        login: string;
        perfilAcesso: import(".prisma/client").$Enums.PerfilAcesso;
        setor: string | null;
        id: string;
    }[]>;
    listCredenciados(): Promise<({
        endereco: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            latitude: number | null;
            longitude: number | null;
            cep: string | null;
            rua: string | null;
            bairro: string | null;
            cidade: string;
            estado: string;
            pais: string;
            credenciadoId: string;
        } | null;
        descarbonizacao: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            distanciaIdaVoltaKm: number;
            tipoCombustivel: import(".prisma/client").$Enums.TipoCombustivel;
            latitudeOrigem: number | null;
            longitudeOrigem: number | null;
            pegadaCo2: number | null;
            credenciadoId: string;
        } | null;
        credencial: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ticketId: string;
            qrToken: string;
            downloads: number;
            printCount: number;
            status: string;
            credenciadoId: string;
        } | null;
    } & {
        nomeCompleto: string;
        cpf: string;
        rg: string | null;
        celular: string;
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        eventoId: string;
        tipoCategoria: import(".prisma/client").$Enums.TipoCategoria;
        cnpj: string | null;
        ccir: string | null;
        nomeEmpresa: string | null;
        siteEmpresa: string | null;
        nomePropriedade: string | null;
        nomeVeiculo: string | null;
        aceiteLgpd: boolean;
    })[]>;
    listEnderecos(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        latitude: number | null;
        longitude: number | null;
        cep: string | null;
        rua: string | null;
        bairro: string | null;
        cidade: string;
        estado: string;
        pais: string;
        credenciadoId: string;
    }[]>;
    listEnderecoCache(): Promise<{
        id: string;
        createdAt: Date;
        latitude: number | null;
        longitude: number | null;
        cep: string;
        rua: string;
        bairro: string;
        cidade: string;
        estado: string;
        pais: string;
        atualizado: Date;
    }[]>;
    listDescarbonizacao(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        distanciaIdaVoltaKm: number;
        tipoCombustivel: import(".prisma/client").$Enums.TipoCombustivel;
        latitudeOrigem: number | null;
        longitudeOrigem: number | null;
        pegadaCo2: number | null;
        credenciadoId: string;
    }[]>;
    listCredenciais(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ticketId: string;
        qrToken: string;
        downloads: number;
        printCount: number;
        status: string;
        credenciadoId: string;
    }[]>;
    listQrScans(): Promise<{
        id: string;
        createdAt: Date;
        ticketId: string;
        scannerId: string;
        scanType: string;
    }[]>;
}
