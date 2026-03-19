import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PerfilAcesso } from '@prisma/client';

export class PromoverCredenciadoDto {
  @ApiProperty({
    example: '12345678901',
    description: 'CPF do credenciado já cadastrado no sistema',
  })
  @IsNotEmpty()
  @IsString()
  cpf: string;

  @ApiProperty({
    example: 'joao.silva',
    description: 'Login de acesso ao sistema para o usuário promovido',
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha em texto puro (será criptografada)',
  })
  @IsNotEmpty()
  @IsString()
  senhaPura: string;

  @ApiProperty({
    enum: ['ADMIN', 'LEITOR_CATRACA'],
    example: 'LEITOR_CATRACA',
    description: 'Nível de acesso a ser concedido ao credenciado',
  })
  @IsEnum(PerfilAcesso)
  perfilAcesso: PerfilAcesso;

  @ApiProperty({
    example: 'PORTARIA',
    required: false,
    description: 'Setor de atuação (opcional)',
  })
  @IsOptional()
  @IsString()
  setor?: string;
}
