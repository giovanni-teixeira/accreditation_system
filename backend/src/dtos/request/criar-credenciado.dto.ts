import {
  IsString,
  IsEmail,
  IsBoolean,
  IsNotEmpty,
  Length,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoCombustivel, TipoCategoria } from '@prisma/client';

export class CriarCredenciadoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O nome completo é obrigatório' })
  nomeCompleto: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O CPF é obrigatório' })
  cpf: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O RG é obrigatório' })
  rg: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O celular é obrigatório' })
  celular: string;

  @ApiProperty()
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O CEP é obrigatório' })
  cep: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'A rua é obrigatória' })
  rua: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O bairro é obrigatório' })
  bairro: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'A cidade é obrigatória' })
  cidade: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O estado é obrigatório' })
  estado: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O país é obrigatório' })
  pais: string;

  @ApiProperty()
  @IsBoolean()
  aceiteLgpd: boolean;

  @ApiProperty({ enum: TipoCombustivel })
  @IsEnum(TipoCombustivel)
  @IsNotEmpty({ message: 'O tipo de combustível é obrigatório' })
  tipoCombustivel: TipoCombustivel;

  @ApiProperty({ enum: TipoCategoria })
  @IsEnum(TipoCategoria)
  @IsNotEmpty({ message: 'A categoria (tipo) é obrigatória' })
  tipoCategoria: TipoCategoria;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ccir?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nomeEmpresa?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  siteEmpresa?: string;
}
