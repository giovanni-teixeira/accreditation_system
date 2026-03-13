"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class RegisterDto {
    login;
    senhaPura;
    perfilAcesso;
    nomeCompleto;
    cpf;
    rg;
    celular;
    email;
    setor;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'porteiro_entrada' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "login", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'senhaForte123' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "senhaPura", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.PerfilAcesso, example: client_1.PerfilAcesso.LEITOR_CATRACA }),
    (0, class_validator_1.IsEnum)(client_1.PerfilAcesso),
    __metadata("design:type", String)
], RegisterDto.prototype, "perfilAcesso", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'João da Silva', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "nomeCompleto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123.456.789-00', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "cpf", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12.345.678-9', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "rg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '(16) 99999-9999', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "celular", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'joao@email.com', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Portaria 1', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "setor", void 0);
//# sourceMappingURL=register.dto.js.map