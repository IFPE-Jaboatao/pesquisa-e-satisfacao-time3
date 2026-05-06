import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../user-role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  matricula?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  nome?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role
}