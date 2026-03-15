import { PrismaService } from '../prisma.service';
export declare class DataService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listEventos(): Promise<{
        id: string;
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
            latitude: number | null;
            longitude: number | null;
            cep: string;
            rua: string;
            bairro: string;
            cidade: string;
            estado: string;
            pais: string;
            credenciadoId: string;
        } | null;
        descarbonizacao: {
            id: string;
            distanciaIdaVoltaKm: number;
            tipoCombustivel: import(".prisma/client").$Enums.TipoCombustivel;
            latitudeOrigem: number | null;
            longitudeOrigem: number | null;
            pegadaCo2: number | null;
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
        id: string;
        eventoId: string;
        tipoCategoria: import(".prisma/client").$Enums.TipoCategoria;
        cnpj: string | null;
        ccir: string | null;
        nomeEmpresa: string | null;
        siteEmpresa: string | null;
        aceiteLgpd: boolean;
    })[]>;
    listEnderecos(): Promise<{
        id: string;
        latitude: number | null;
        longitude: number | null;
        cep: string;
        rua: string;
        bairro: string;
        cidade: string;
        estado: string;
        pais: string;
        credenciadoId: string;
    }[]>;
    listEnderecoCache(): Promise<{
        id: string;
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
        distanciaIdaVoltaKm: number;
        tipoCombustivel: import(".prisma/client").$Enums.TipoCombustivel;
        latitudeOrigem: number | null;
        longitudeOrigem: number | null;
        pegadaCo2: number | null;
        credenciadoId: string;
    }[]>;
    listCredenciais(): Promise<{
        id: string;
        ticketId: string;
        qrToken: string;
        downloads: number;
        printCount: number;
        status: string;
        createdAt: Date;
        credenciadoId: string;
    }[]>;
    listQrScans(): Promise<{
        id: string;
        ticketId: string;
        createdAt: Date;
        scannerId: string;
        scanType: string;
    }[]>;
}
