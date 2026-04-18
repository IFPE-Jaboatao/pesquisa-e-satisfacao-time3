import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../user-role.enum';

export class CreateUserDto {
  @IsString()
  username!: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  password!: string;
}