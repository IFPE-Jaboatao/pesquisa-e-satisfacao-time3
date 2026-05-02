import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../user-role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role
}