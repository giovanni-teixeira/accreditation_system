import { IEvento } from '../../interfaces/evento.interface';
export declare class EventoResponseDto {
    id: string;
    nomeEvento: string;
    isGratuito: boolean;
    publicKey: string | null;
    constructor(partial: IEvento);
}
