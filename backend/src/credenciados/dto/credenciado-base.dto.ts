import { IsString, IsEmail, IsBoolean, IsNotEmpty, Length, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoCombustivel } from '@prisma/client';

export class CredenciadoBaseDto {
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
    @Length(2, 2, { message: 'O estado deve ter exatamente 2 caracteres' })
    @IsNotEmpty({ message: 'O estado é obrigatório' })
    estado: string;

    @ApiProperty()
    @IsBoolean()
    aceiteLgpd: boolean;

    @ApiProperty()
    @IsEnum(TipoCombustivel)
    @IsNotEmpty({ message: 'O tipo de combustível é obrigatório' })
    tipoCombustivel: TipoCombustivel;
}
