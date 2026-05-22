import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    example: '202611500', 
    description: 'Matrícula institucional do usuário' 
  })
  @IsString()
  @IsNotEmpty()
  matricula!: string;

  @ApiProperty({ 
    example: 'senha123', 
    description: 'Senha de acesso',
    minLength: 6 
  })
  @IsString()
  @MinLength(6)
  password!: string;
}