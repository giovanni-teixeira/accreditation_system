import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AtualizarEventoDto {
  @ApiProperty({ required: false, description: 'Nome do evento' })
  @IsOptional()
  @IsString()
  nomeEvento?: string;

  @ApiProperty({ required: false, description: 'É gratuito?' })
  @IsOptional()
  @IsBoolean()
  isGratuito?: boolean;

  @ApiProperty({ required: false, description: 'Local do evento' })
  @IsOptional()
  @IsString()
  localEvento?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsNumber() latitude?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() longitude?: number;
}
