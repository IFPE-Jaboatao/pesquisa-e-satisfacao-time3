import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../user-role.enum';

export class CreateUserDto {
  @ApiProperty({ 
    description: 'Nome de usuário único para acesso ao sistema',
    example: 'lucas_gestor' 
  })
  @IsString()
  username!: string;

  @ApiProperty({ 
    description: 'Papel do usuário no sistema',
    enum: Role,
    default: Role.ALUNO,
    required: false 
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({ 
    description: 'Senha de acesso (mínimo de 6 caracteres)',
    example: 'senha123',
    minLength: 6 
  })
  @IsString()
  @MinLength(6)
  password!: string;
}