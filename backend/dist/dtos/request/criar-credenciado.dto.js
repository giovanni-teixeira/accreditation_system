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
exports.CriarCredenciadoDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CriarCredenciadoDto {
    nomeCompleto;
    cpf;
    rg;
    celular;
    email;
    cep;
    rua;
    bairro;
    cidade;
    estado;
    pais;
    aceiteLgpd;
    tipoCombustivel;
    tipoCategoria;
    cnpj;
    ccir;
    nomeEmpresa;
    siteEmpresa;
}
exports.CriarCredenciadoDto = CriarCredenciadoDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome completo é obrigatório' }),
    __metadata("design:type", String)
], CriarCredenciadoDto.prototype, "nomeCompleto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O CPF é obrigatório' }),
    __metadata("design:type", String)
], CriarCredenciadoDto.prototype, "cpf", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O RG é obrigatório' }),
    __metadata("design:type", String)
], CriarCredenciadoDto.prototype, "rg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O celular é obrigatório' }),
    __metadata("design:type", String)
], CriarCredenciadoDto.prototype, "celular", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEmail)({}, { message: 'E-mail inválido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O e-mail é obrigatório' }),
    __metadata("design:type", String)
], CriarCredenciadoDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O CEP é obrigatório' }),
    __metadata("design:type", String)
], CriarCredenciadoDto.prototype, "cep", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A rua é obrigatória' }),
    __metadata("design:type", String)
], CriarCredenciadoDto.prototype, "rua", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O bairro é obrigatório' }),
    __metadata("design:type", String)
], CriarCredenciadoDto.prototype, "bairro", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A cidade é obrigatória' }),
    __metadata("design:type", String)
], CriarCredenciadoDto.prototype, "cidade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O estado é obrigatório' }),
    __metadata("design:type", String)
], CriarCredenciadoDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O país é obrigatório' }),
    __metadata("design:type", String)
], CriarCredenciadoDto.prototype, "pais", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CriarCredenciadoDto.prototype, "aceiteLgpd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.TipoCombustivel }),
    (0, class_validator_1.IsEnum)(client_1.TipoCombustivel),
    (0, class_validator_1.IsNotEmpty)({ message: 'O tipo de combustível é obrigatório' }),
    __metadata("design:type", String)
], CriarCredenciadoDto.prototype, "tipoCombustivel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.TipoCategoria }),
    (0, class_validator_1.IsEnum)(client_1.TipoCategoria),
    (0, class_validator_1.IsNotEmpty)({ message: 'A categoria (tipo) é obrigatória' }),
    __metadata("design:type", String)
], CriarCredenciadoDto.prototype, "tipoCategoria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CriarCredenciadoDto.prototype, "cnpj", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CriarCredenciadoDto.prototype, "ccir", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CriarCredenciadoDto.prototype, "nomeEmpresa", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CriarCredenciadoDto.prototype, "siteEmpresa", void 0);
//# sourceMappingURL=criar-credenciado.dto.js.map