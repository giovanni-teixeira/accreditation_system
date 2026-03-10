import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CredenciadoBaseDto } from './credenciado-base.dto';

export class CriarImprensaDto extends CredenciadoBaseDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'O CNPJ é obrigatório para profissionais de imprensa' })
    cnpj: string;

}
