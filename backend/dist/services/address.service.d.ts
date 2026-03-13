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
export declare class AddressService {
    private readonly addressRepository;
    private readonly configService;
    private readonly logger;
    constructor(addressRepository: AddressRepository, configService: ConfigService);
    getAddress(cep: string, country?: string): Promise<StandardAddress | null>;
    private tryBrazilianApis;
    private geocodeAddress;
    private tryInternationalApi;
}
