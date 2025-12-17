import { IsEmail, IsOptional, IsEnum, MinLength } from 'class-validator';
import { Role } from '../employee.entity';

export class UpdateEmployeeDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
