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
        const isBrasil = country.toLowerCase() === 'brasil' || country.toUpperCase() === 'BR';
        const cleanCep = isBrasil
            ? cep.replace(/\D/g, '')
            : cep.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        const cacheKey = `${country.substring(0, 2).toUpperCase()}:${cleanCep}`;
        let cached = await this.addressRepository.findByCep(cleanCep);
        if (!cached) {
            cached = await this.addressRepository.findByCep(cacheKey);
        }
        if (cached && cached.pais.toLowerCase() === country.toLowerCase()) {
            this.logger.log(`Endereço encontrado no cache: ${cleanCep} (${country})`);
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
        let addressData = null;
        if (country.toLowerCase() === 'brasil' || country.toUpperCase() === 'BR') {
            addressData = await this.tryBrazilianApis(cleanCep);
            if (!addressData) {
                this.logger.log(`APIs Brasileiras falharam. Tentando Zippopotam.us para BR: ${cleanCep}`);
                addressData = await this.tryInternationalApi(cleanCep, 'BR');
            }
        }
        else {
            addressData = await this.tryInternationalApi(cep, country);
            if (!addressData) {
                this.logger.log(`Fallback Nominatim para Postcode: ${cep}, ${country}`);
                const geo = await this.geocodeAddress('', '', '', `${cep} ${country}`);
                if (geo) {
                    addressData = await this.reverseGeocode(geo.latitude, geo.longitude, cep);
                }
            }
        }
        if (addressData) {
            try {
                await this.addressRepository.create({
                    ...addressData,
                    cep: cacheKey,
                    pais: country,
                });
            }
            catch (e) {
                this.logger.warn(`Erro ao salvar cache (provável duplicata): ${e.message}`);
            }
            return { ...addressData, pais: country };
        }
        return null;
    }
    async reverseGeocode(lat, lon, cep) {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
            const response = await fetch(url, {
                headers: { 'User-Agent': 'Hakaton-Alta-Cafe-App' },
            });
            const data = await response.json();
            if (data && data.address) {
                return {
                    cep,
                    rua: data.address.road || data.address.pedestrian || '',
                    bairro: data.address.suburb || data.address.neighbourhood || '',
                    cidade: data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        '',
                    estado: data.address.state || data.address.region || '',
                    latitude: lat,
                    longitude: lon,
                };
            }
        }
        catch (e) {
            this.logger.error(`Falha no Reverse Geocoding: ${e.message}`);
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
                    latitude: data.location?.coordinates?.latitude
                        ? parseFloat(data.location.coordinates.latitude)
                        : null,
                    longitude: data.location?.coordinates?.longitude
                        ? parseFloat(data.location.coordinates.longitude)
                        : null,
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
                    'User-Agent': 'Hakaton-Alta-Cafe-App',
                },
            });
            const data = (await response.json());
            if (data && data.length > 0) {
                return {
                    latitude: parseFloat(data[0].lat),
                    longitude: parseFloat(data[0].lon),
                };
            }
        }
        catch (e) {
            this.logger.error(`Falha na geocodificação Nominatim: ${e.message}`);
        }
        return null;
    }
    async tryZipBase(cep, country) {
        const apiKey = this.configService.get('ZIPBASE_API_KEY');
        if (!apiKey)
            return null;
        try {
            this.logger.log(`Consultando ZipBase.io: ${cep}, ${country}`);
            const response = await fetch(`https://zipbase.io/api/v1/lookup?postalCode=${cep}&country=${country}`, {
                headers: { 'X-API-Key': apiKey },
            });
            const data = await response.json();
            if (response.ok && data) {
                return {
                    cep,
                    rua: data.address || '',
                    bairro: data.neighborhood || '',
                    cidade: data.city || '',
                    estado: data.state || '',
                    latitude: data.latitude ? parseFloat(data.latitude) : null,
                    longitude: data.longitude ? parseFloat(data.longitude) : null,
                };
            }
        }
        catch (e) {
            this.logger.error(`Falha no ZipBase.io: ${e.message}`);
        }
        return null;
    }
    async tryGeonames(cep, country) {
        const username = this.configService.get('GEONAMES_USERNAME') || 'demo';
        try {
            this.logger.log(`Consultando Geonames: ${cep}, ${country}`);
            const response = await fetch(`http://api.geonames.org/postalCodeLookupJSON?postalcode=${cep}&country=${country}&username=${username}`);
            const data = await response.json();
            if (data && data.postalcodes && data.postalcodes.length > 0) {
                const place = data.postalcodes[0];
                return {
                    cep,
                    rua: '',
                    bairro: '',
                    cidade: place.placeName || '',
                    estado: place.adminName1 || '',
                    latitude: place.lat ? parseFloat(place.lat) : null,
                    longitude: place.lng ? parseFloat(place.lng) : null,
                };
            }
        }
        catch (e) {
            this.logger.error(`Falha no Geonames: ${e.message}`);
        }
        return null;
    }
    async tryInternationalApi(cep, country) {
        let address = await this.tryZippopotamus(cep, country);
        if (address)
            return address;
        address = await this.tryZipBase(cep, country);
        if (address)
            return address;
        address = await this.tryGeonames(cep, country);
        if (address)
            return address;
        return null;
    }
    async tryZippopotamus(cep, country) {
        try {
            this.logger.log(`Consultando Zippopotam.us: ${cep}, ${country}`);
            const countryCode = country.length === 2
                ? country.toLowerCase()
                : country.substring(0, 2).toLowerCase();
            const response = await fetch(`http://api.zippopotam.us/${countryCode}/${cep}`);
            const data = await response.json();
            if (response.ok && data.places && data.places.length > 0) {
                const place = data.places[0];
                return {
                    cep,
                    rua: '',
                    bairro: '',
                    cidade: place['place name'] || '',
                    estado: place['state abbreviation'] || place['state'] || '',
                    latitude: place.latitude ? parseFloat(place.latitude) : null,
                    longitude: place.longitude ? parseFloat(place.longitude) : null,
                };
            }
        }
        catch (e) {
            this.logger.error(`Falha no Zippopotam.us: ${e.message}`);
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