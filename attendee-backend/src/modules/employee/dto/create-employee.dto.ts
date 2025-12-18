import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export enum Role {
  HR = 'HR',
  EMPLOYEE = 'Employee',
}

export class CreateEmployeeDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
