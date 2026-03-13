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
var AddressService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const address_repository_1 = require("../repositories/address.repository");
let AddressService = AddressService_1 = class AddressService {
    addressRepository;
    configService;
    logger = new common_1.Logger(AddressService_1.name);
    constructor(addressRepository, configService) {
        this.addressRepository = addressRepository;
        this.configService = configService;
    }
    async getAddress(cep, country = 'Brasil') {
        const cleanCep = cep.replace(/\D/g, '');
        const cached = await this.addressRepository.findByCep(cleanCep);
        if (cached) {
            this.logger.log(`Endereço encontrado no cache: ${cleanCep}`);
            return {
                cep: cached.cep,
                rua: cached.rua,
                bairro: cached.bairro,
                cidade: cached.cidade,
                estado: cached.estado,
                pais: cached.pais,
                latitude: cached.latitude ?? null,
                longitude: cached.longitude ?? null,
            };
        }
        if (country.toLowerCase() === 'brasil' || country.toUpperCase() === 'BR') {
            const brasilData = await this.tryBrazilianApis(cleanCep);
            if (brasilData) {
                await this.addressRepository.create({
                    ...brasilData,
                    pais: 'Brasil',
                });
                return { ...brasilData, pais: 'Brasil' };
            }
        }
        const internationalData = await this.tryInternationalApi(cep, country);
        if (internationalData) {
            if (internationalData.latitude === null || internationalData.longitude === null) {
                const geo = await this.geocodeAddress(internationalData.rua, internationalData.cidade, internationalData.estado, country);
                if (geo) {
                    internationalData.latitude = geo.latitude;
                    internationalData.longitude = geo.longitude;
                }
            }
            await this.addressRepository.create({
                ...internationalData,
                pais: country,
            });
            return { ...internationalData, pais: country };
        }
        return null;
    }
    async tryBrazilianApis(cep) {
        try {
            this.logger.log(`Consultando BrasilAPI: ${cep}`);
            const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
            const data = await response.json();
            if (response.ok) {
                const result = {
                    cep,
                    rua: data.street || '',
                    bairro: data.neighborhood || '',
                    cidade: data.city || '',
                    estado: data.state || '',
                    latitude: data.location?.coordinates?.latitude ? parseFloat(data.location.coordinates.latitude) : null,
                    longitude: data.location?.coordinates?.longitude ? parseFloat(data.location.coordinates.longitude) : null,
                };
                if (result.latitude === null || result.longitude === null) {
                    const geo = await this.geocodeAddress(result.rua, result.cidade, result.estado, 'Brasil');
                    if (geo) {
                        result.latitude = geo.latitude;
                        result.longitude = geo.longitude;
                    }
                }
                return result;
            }
        }
        catch (e) {
            this.logger.error(`Falha na BrasilAPI: ${e.message}`);
        }
        try {
            this.logger.log(`Consultando ViaCEP: ${cep}`);
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                const result = {
                    cep,
                    rua: data.logradouro || '',
                    bairro: data.bairro || '',
                    cidade: data.localidade || '',
                    estado: data.uf || '',
                    latitude: null,
                    longitude: null,
                };
                const geo = await this.geocodeAddress(result.rua, result.cidade, result.estado, 'Brasil');
                if (geo) {
                    result.latitude = geo.latitude;
                    result.longitude = geo.longitude;
                }
                return result;
            }
        }
        catch (e) {
            this.logger.error(`Falha no ViaCEP: ${e.message}`);
        }
        return null;
    }
    async geocodeAddress(rua, cidade, estado, pais) {
        try {
            this.logger.log(`Geocodificando endereço via Nominatim: ${rua}, ${cidade}, ${estado}, ${pais}`);
            const query = encodeURIComponent(`${rua} ${cidade} ${estado} ${pais}`);
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Hakaton-Alta-Cafe-App'
                }
            });
            const data = await response.json();
            if (data && data.length > 0) {
                return {
                    latitude: parseFloat(data[0].lat),
                    longitude: parseFloat(data[0].lon)
                };
            }
        }
        catch (e) {
            this.logger.error(`Falha na geocodificação Nominatim: ${e.message}`);
        }
        return null;
    }
    async tryInternationalApi(cep, country) {
        const apiKey = this.configService.get('ZIPCODE_API_KEY');
        if (!apiKey)
            return null;
        try {
            this.logger.log(`Consultando Zipcodebase: ${cep}, ${country}`);
            const response = await fetch(`https://app.zipcodebase.com/api/v1/search?apikey=${apiKey}&codes=${cep}&country=${country}`);
            const data = await response.json();
            const result = data.results?.[cep]?.[0];
            if (result) {
                return {
                    cep,
                    rua: result.line_1 || '',
                    bairro: result.province_sub || '',
                    cidade: result.city || '',
                    estado: result.province || '',
                    latitude: result.latitude ? parseFloat(result.latitude) : null,
                    longitude: result.longitude ? parseFloat(result.longitude) : null,
                };
            }
        }
        catch (e) {
            this.logger.error(`Falha no Zipcodebase: ${e.message}`);
        }
        return null;
    }
};
exports.AddressService = AddressService;
exports.AddressService = AddressService = AddressService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [address_repository_1.AddressRepository,
        config_1.ConfigService])
], AddressService);
//# sourceMappingURL=address.service.js.map