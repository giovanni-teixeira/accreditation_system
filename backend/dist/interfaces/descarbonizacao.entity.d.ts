export declare enum TipoCombustivel {
    GASOLINA = "GASOLINA",
    ETANOL = "ETANOL",
    DIESEL = "DIESEL",
    ELETRICO = "ELETRICO"
}
export interface IDescarbonizacao {
    id: string;
    credenciadoId: string;
    distanciaIdaVoltaKm: number;
    tipoCombustivel: TipoCombustivel;
    latitudeOrigem?: number;
    longitudeOrigem?: number;
    pegadaCo2?: number;
}
