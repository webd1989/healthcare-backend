import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  status: number;
}