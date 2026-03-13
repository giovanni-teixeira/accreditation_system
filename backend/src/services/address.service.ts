// src/services/address.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AddressRepository } from '../repositories/address.repository';

export interface StandardAddress {
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    pais: string;
    latitude: number | null;
    longitude: number | null;
}

@Injectable()
export class AddressService {
    private readonly logger = new Logger(AddressService.name);

    constructor(
        private readonly addressRepository: AddressRepository,
        private readonly configService: ConfigService,
    ) { }

    async getAddress(cep: string, country: string = 'Brasil'): Promise<StandardAddress | null> {
        const cleanCep = cep.replace(/\D/g, '');

        // 1. Verificar Cache no Banco
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

        // 2. Se for Brasil, tentar APIs nacionais
        if (country.toLowerCase() === 'brasil' || country.toUpperCase() === 'BR') {
            const brasilData = await this.tryBrazilianApis(cleanCep);
            if (brasilData) {
                // Salvar no Cache
                await this.addressRepository.create({
                    ...brasilData,
                    pais: 'Brasil',
                } as any);
                return { ...brasilData, pais: 'Brasil' };
            }
        }

        // 3. Tentar API Internacional (Zipcodebase)
        const internationalData = await this.tryInternationalApi(cep, country);
        if (internationalData) {
            // Se não tem coordenadas, tenta geocodificar pelo texto do endereço
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

    private async tryBrazilianApis(cep: string): Promise<Omit<StandardAddress, 'pais'> | null> {
        // TENTATIVA 1: BrasilAPI (Prioridade por ter Lat/Long)
        try {
            this.logger.log(`Consultando BrasilAPI: ${cep}`);
            const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
            const data = await response.json() as any;

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

                // Fallback: Se BrasilAPI não trouxe coordenadas (comum em CEPs genéricos), tenta Nominatim
                if (result.latitude === null || result.longitude === null) {
                    const geo = await this.geocodeAddress(result.rua, result.cidade, result.estado, 'Brasil');
                    if (geo) {
                        result.latitude = geo.latitude;
                        result.longitude = geo.longitude;
                    }
                }

                return result;
            }
        } catch (e) {
            this.logger.error(`Falha na BrasilAPI: ${e.message}`);
        }

        // TENTATIVA 2: ViaCEP (Fallback para garantir o endereço)
        try {
            this.logger.log(`Consultando ViaCEP: ${cep}`);
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json() as any;

            if (!data.erro) {
                const result = {
                    cep,
                    rua: data.logradouro || '',
                    bairro: data.bairro || '',
                    cidade: data.localidade || '',
                    estado: data.uf || '',
                    latitude: null as number | null,
                    longitude: null as number | null,
                };

                // ViaCEP nunca traz coordenadas, então SEMPRE tenta Nominatim aqui
                const geo = await this.geocodeAddress(result.rua, result.cidade, result.estado, 'Brasil');
                if (geo) {
                    result.latitude = geo.latitude;
                    result.longitude = geo.longitude;
                }

                return result;
            }
        } catch (e) {
            this.logger.error(`Falha no ViaCEP: ${e.message}`);
        }

        return null;
    }

    private async geocodeAddress(rua: string, cidade: string, estado: string, pais: string): Promise<{ latitude: number, longitude: number } | null> {
        try {
            this.logger.log(`Geocodificando endereço via Nominatim: ${rua}, ${cidade}, ${estado}, ${pais}`);
            
            // Monta a query: Rua, Cidade, Estado, Pais
            const query = encodeURIComponent(`${rua} ${cidade} ${estado} ${pais}`);
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;
            
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Hakaton-Alta-Cafe-App' // Nominatim exige um User-Agent
                }
            });
            
            const data = await response.json() as any[];
            
            if (data && data.length > 0) {
                return {
                    latitude: parseFloat(data[0].lat),
                    longitude: parseFloat(data[0].lon)
                };
            }
        } catch (e) {
            this.logger.error(`Falha na geocodificação Nominatim: ${e.message}`);
        }
        return null;
    }

    private async tryInternationalApi(cep: string, country: string): Promise<Omit<StandardAddress, 'pais'> | null> {
        const apiKey = this.configService.get<string>('ZIPCODE_API_KEY');
        if (!apiKey) return null;

        try {
            this.logger.log(`Consultando Zipcodebase: ${cep}, ${country}`);
            const response = await fetch(`https://app.zipcodebase.com/api/v1/search?apikey=${apiKey}&codes=${cep}&country=${country}`);
            const data = await response.json() as any;

            // Zipcodebase retorna um mapa de códigos
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
        } catch (e) {
            this.logger.error(`Falha no Zipcodebase: ${e.message}`);
        }

        return null;
    }
}
