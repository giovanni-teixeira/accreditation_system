import { IEvento } from '../../interfaces';

export class EventoResponseDto {
  id: string;
  nomeEvento: string;
  isGratuito: boolean;
  publicKey: string | null;

  constructor(partial: IEvento) {
    this.id = partial.id;
    this.nomeEvento = partial.nomeEvento;
    this.isGratuito = partial.isGratuito;
    this.publicKey = partial.publicKey ?? null;
    // Note: privateKey is explicitly NOT included here for security
  }
}
