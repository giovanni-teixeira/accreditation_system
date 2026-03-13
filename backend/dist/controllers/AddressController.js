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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const address_service_1 = require("../services/address.service");
const business_exception_1 = require("../common/exceptions/business.exception");
let AddressController = class AddressController {
    addressService;
    constructor(addressService) {
        this.addressService = addressService;
    }
    async getAddress(zipCode, country = 'Brasil') {
        try {
            const address = await this.addressService.getAddress(zipCode, country);
            if (!address) {
                throw new business_exception_1.BusinessException('Endereço não encontrado nas bases disponíveis.', 404);
            }
            return address;
        }
        catch (error) {
            if (error instanceof business_exception_1.BusinessException)
                throw error;
            throw new business_exception_1.BusinessException(`Erro ao buscar endereço: ${error.message}`);
        }
    }
};
exports.AddressController = AddressController;
__decorate([
    (0, common_1.Get)(':zipCode'),
    (0, swagger_1.ApiOperation)({
        summary: 'Busca endereço por CEP/Postcode com fallback e cache',
    }),
    (0, swagger_1.ApiParam)({ name: 'zipCode', description: 'Código postal (CEP ou Postcode)' }),
    (0, swagger_1.ApiQuery)({
        name: 'country',
        required: false,
        description: 'País (Default: Brasil)',
    }),
    __param(0, (0, common_1.Param)('zipCode')),
    __param(1, (0, common_1.Query)('country')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AddressController.prototype, "getAddress", null);
exports.AddressController = AddressController = __decorate([
    (0, swagger_1.ApiTags)('Endereços'),
    (0, common_1.Controller)('address'),
    __metadata("design:paramtypes", [address_service_1.AddressService])
], AddressController);
//# sourceMappingURL=AddressController.js.map