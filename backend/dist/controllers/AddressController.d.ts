import { AddressService } from '../services/address.service';
export declare class AddressController {
    private readonly addressService;
    constructor(addressService: AddressService);
    getAddress(zipCode: string, country?: string): Promise<import("../services/address.service").StandardAddress>;
}
