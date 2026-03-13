// src/controllers/AddressController.ts
import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AddressService } from '../services/address.service';

@ApiTags('Endereços')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get(':zipCode')
  @ApiOperation({
    summary: 'Busca endereço por CEP/Postcode com fallback e cache',
  })
  @ApiParam({ name: 'zipCode', description: 'Código postal (CEP ou Postcode)' })
  @ApiQuery({
    name: 'country',
    required: false,
    description: 'País (Default: Brasil)',
  })
  async getAddress(
    @Param('zipCode') zipCode: string,
    @Query('country') country: string = 'Brasil',
  ) {
    const address = await this.addressService.getAddress(zipCode, country);

    if (!address) {
      throw new NotFoundException(
        'Endereço não encontrado nas bases disponíveis.',
      );
    }

    return address;
  }
}
