"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventoResponseDto = void 0;
class EventoResponseDto {
    id;
    nomeEvento;
    isGratuito;
    publicKey;
    constructor(partial) {
        this.id = partial.id;
        this.nomeEvento = partial.nomeEvento;
        this.isGratuito = partial.isGratuito;
        this.publicKey = partial.publicKey;
    }
}
exports.EventoResponseDto = EventoResponseDto;
//# sourceMappingURL=evento-response.dto.js.map