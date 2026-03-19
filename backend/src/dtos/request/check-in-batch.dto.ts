import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckInBatchDto {
  @ApiProperty({
    description: 'Lista de IDs de Tickets/Credenciais para sincronização',
    type: [String],
    example: ['TKT-123', 'TKT-456']
  })
  @IsArray({ message: 'ticketIds deve ser um array' })
  @IsString({ each: true, message: 'Cada item em ticketIds deve ser uma string' })
  @IsNotEmpty({ message: 'A lista de ticketIds não pode estar vazia' })
  ticketIds: string[];
}
