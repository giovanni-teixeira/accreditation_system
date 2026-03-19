import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckInDto {
  @ApiProperty({
    description: 'ID do Ticket/Credencial a ser validado',
    example: 'TKT-12345',
  })
  @IsString()
  @IsNotEmpty({ message: 'O ticketId é obrigatório' })
  ticketId: string;
}
