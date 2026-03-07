import { IsString, IsEmail, IsBoolean, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    @IsNotEmpty({ message: 'O município é obrigatório' })
    municipio: string;

    @ApiProperty()
    @IsString()
    @Length(2, 2, { message: 'A UF deve ter exatamente 2 caracteres' })
    @IsNotEmpty({ message: 'A UF é obrigatória' })
    uf: string;

    @ApiProperty()
    @IsBoolean()
    aceitouLgpd: boolean;
}
