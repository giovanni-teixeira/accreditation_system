"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredenciadoResponseDto = void 0;
class CredenciadoResponseDto {
    id;
    nomeCompleto;
    cpf;
    email;
    tipoCategoria;
    tipoCombustivel;
    endereco;
    credencial;
    constructor(partial) {
        this.id = partial.id;
        this.nomeCompleto = partial.nomeCompleto;
        this.cpf = partial.cpf;
        this.email = partial.email;
        this.tipoCategoria = partial.tipoCategoria;
        this.tipoCombustivel = partial.tipoCombustivel;
        this.endereco = partial.endereco;
        this.credencial = partial.credencial
            ? {
                ticketId: partial.credencial.ticketId,
                status: partial.credencial.status,
                qrToken: partial.credencial.qrToken,
            }
            : null;
    }
}
exports.CredenciadoResponseDto = CredenciadoResponseDto;
//# sourceMappingURL=credenciado-response.dto.js.map