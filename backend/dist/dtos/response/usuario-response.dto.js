"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioResponseDto = void 0;
class UsuarioResponseDto {
    id;
    login;
    perfilAcesso;
    constructor(partial) {
        this.id = partial.id;
        this.login = partial.login;
        this.perfilAcesso = partial.perfilAcesso;
    }
}
exports.UsuarioResponseDto = UsuarioResponseDto;
//# sourceMappingURL=usuario-response.dto.js.map