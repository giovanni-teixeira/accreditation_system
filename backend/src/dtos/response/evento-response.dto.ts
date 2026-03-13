// src/dtos/response/evento-response.dto.ts
export class EventoResponseDto {
  id: string;
  nomeEvento: string;
  isGratuito: boolean;
  publicKey: string | null;

  constructor(partial: any) {
    this.id = partial.id;
    this.nomeEvento = partial.nomeEvento;
    this.isGratuito = partial.isGratuito;
    this.publicKey = partial.publicKey;
    // Note: privateKey is explicitly NOT included here for security
  }
}
