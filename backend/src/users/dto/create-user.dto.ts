import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
import { Role } from '../user-role.enum';

export class CreateUserDto {
  @IsString()
  matricula!: string;

  @IsString()
  @MinLength(5)
  nome!: string;

  @IsString()
  @IsEmail()
  email!: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  @MinLength(6)
  password!: string;

  @ValidateIf(o => o.tipo !== Role.ADMIN)
  @IsNotEmpty({ message: 'O campusId é obrigatório para usuários que não são administradores.' })
  @IsNumber({}, { message: 'O campusId deve ser um número.' })
  campusId?: number;
}