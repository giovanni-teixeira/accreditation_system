import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CredenciadoBaseDto } from './credenciado-base.dto';

export class CriarCafeicultorDto extends CredenciadoBaseDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'O CCIR é obrigatório para cafeicultores' })
    ccir: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'O nome da propriedade é obrigatório para cafeicultores' })
    nomePropriedade: string;
}
