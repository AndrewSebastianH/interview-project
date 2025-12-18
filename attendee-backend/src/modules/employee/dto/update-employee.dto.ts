import {
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { Role } from '../employee.entity';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsOptional()
  @MinLength(6)
  @IsNotEmpty()
  password?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
