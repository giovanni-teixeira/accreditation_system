import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PerfilAcesso } from '@prisma/client';

export class AtualizarUsuarioDto {
  @ApiProperty({ required: false, description: 'Nova senha em texto puro' })
  @IsOptional()
  @IsString()
  senhaPura?: string;

  @ApiProperty({ required: false, enum: PerfilAcesso })
  @IsOptional()
  @IsEnum(PerfilAcesso)
  perfilAcesso?: PerfilAcesso;

  @ApiProperty({ required: false, description: 'Setor do usuário' })
  @IsOptional()
  @IsString()
  setor?: string;
}
