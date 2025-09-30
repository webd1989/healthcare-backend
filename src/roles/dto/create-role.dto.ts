import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  permissions: string;

  @IsOptional()
  @IsNumber()
  status: number;
}