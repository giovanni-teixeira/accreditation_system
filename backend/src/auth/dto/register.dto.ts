import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
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
}
