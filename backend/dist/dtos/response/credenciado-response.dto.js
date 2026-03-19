"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredenciadoResponseDto = void 0;
class CredenciadoResponseDto {
    id;
    nomeCompleto;
    cpf;
    email;
    tipoCategoria;
    endereco;
    credencial;
    descarbonizacao;
    nomeEmpresa;
    nomePropriedade;
    nomeVeiculo;
    constructor(partial) {
        this.id = partial.id;
        this.nomeCompleto = partial.nomeCompleto;
        this.cpf = partial.cpf;
        this.email = partial.email;
        this.tipoCategoria = partial.tipoCategoria;
        this.nomeEmpresa = partial.nomeEmpresa;
        this.nomePropriedade = partial.nomePropriedade;
        this.nomeVeiculo = partial.nomeVeiculo;
        this.endereco = partial.endereco ?? null;
        this.descarbonizacao = partial.descarbonizacao ?? null;
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