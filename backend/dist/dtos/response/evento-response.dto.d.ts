import { IEvento } from '../../interfaces';
export declare class EventoResponseDto {
    id: string;
    nomeEvento: string;
    isGratuito: boolean;
    publicKey: string | null;
    constructor(partial: IEvento);
}
