import { Global, Injectable } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'admin' })
    @IsNotEmpty()
    @IsString()
    login: string;

    @ApiProperty({ example: 'senha123' })
    @IsNotEmpty()
    @IsString()
    senhaHash: string;
}
