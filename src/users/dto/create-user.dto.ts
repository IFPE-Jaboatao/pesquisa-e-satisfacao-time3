import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../user-role.enum';

export class CreateUserDto {
  @IsString()
  username!: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  @MinLength(6)
  password!: string;
}