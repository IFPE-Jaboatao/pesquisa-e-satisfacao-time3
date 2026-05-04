import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
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
}