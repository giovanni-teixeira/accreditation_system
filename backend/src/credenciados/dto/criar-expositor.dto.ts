import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CredenciadoBaseDto } from './credenciado-base.dto';

export class CriarExpositorDto extends CredenciadoBaseDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'O CNPJ é obrigatório para expositores' })
    cnpj: string;

}
