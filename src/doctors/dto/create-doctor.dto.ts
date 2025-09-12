import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateDoctorDto {

  @IsNumber()
  @IsNotEmpty()
  hospital_id: number;

  @IsOptional()
  @IsString()
  type: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  mobile: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsNumber()
  status: number;

}