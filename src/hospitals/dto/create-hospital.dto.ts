import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateHospitalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsNumber()
  status: number;
}