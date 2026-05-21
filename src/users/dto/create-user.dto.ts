import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../user-role.enum';

export class CreateUserDto {
  @ApiProperty({ example: '202611500', description: 'Matrícula institucional única' })
  @IsString()
  matricula!: string;

  @ApiProperty({ example: 'Lucas Souza', minLength: 5 })
  @IsString()
  @MinLength(5)
  nome!: string;

  @ApiProperty({ example: 'lucas@email.com' })
  @IsString()
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ enum: Role, default: Role.ALUNO })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({ example: 'senha123', minLength: 6, description: 'Senha de acesso ao sistema' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'ID do Campus vinculado. Obrigatório se não for ADMIN.' 
  })
  @ValidateIf(o => o.tipo !== Role.ADMIN)
  @IsNotEmpty({ message: 'O campusId é obrigatório para usuários que não são administradores.' })
  @IsNumber({}, { message: 'O campusId deve ser um número.' })
  campusId?: number;
}