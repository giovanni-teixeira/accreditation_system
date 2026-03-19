import { IsString, IsOptional, IsBoolean, IsEmail, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoCategoria, TipoCombustivel } from '@prisma/client';

export class AtualizarCredenciadoDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() nomeCompleto?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() rg?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() celular?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsEmail() email?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() cnpj?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() ccir?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() nomeEmpresa?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() siteEmpresa?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() nomePropriedade?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() nomeVeiculo?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() aceiteLgpd?: boolean;
  @ApiProperty({ required: false, enum: TipoCategoria }) @IsOptional() @IsEnum(TipoCategoria) tipoCategoria?: TipoCategoria;
  @ApiProperty({ required: false, enum: TipoCombustivel }) @IsOptional() @IsEnum(TipoCombustivel) tipoCombustivel?: TipoCombustivel;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() distanciaManualKm?: number;
  // Endereço
  @ApiProperty({ required: false }) @IsOptional() @IsString() cep?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() cidade?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() estado?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() pais?: string;
}
