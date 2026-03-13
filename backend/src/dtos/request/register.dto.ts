import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PerfilAcesso } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'porteiro_entrada' })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({ example: 'senhaForte123' })
  @IsNotEmpty()
  @IsString()
  senhaPura: string;

  @ApiProperty({ enum: PerfilAcesso, example: PerfilAcesso.LEITOR_CATRACA })
  @IsEnum(PerfilAcesso)
  perfilAcesso: PerfilAcesso;

  @ApiProperty({ example: 'João da Silva', required: false })
  @IsOptional()
  @IsString()
  nomeCompleto?: string;

  @ApiProperty({ example: '123.456.789-00', required: false })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiProperty({ example: '12.345.678-9', required: false })
  @IsOptional()
  @IsString()
  rg?: string;

  @ApiProperty({ example: '(16) 99999-9999', required: false })
  @IsOptional()
  @IsString()
  celular?: string;

  @ApiProperty({ example: 'joao@email.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 'Portaria 1', required: false })
  @IsOptional()
  @IsString()
  setor?: string;
}
