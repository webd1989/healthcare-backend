import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreatePatientDto {

  @IsNumber()
  @IsNotEmpty()
  hospital_id: number;

  @IsNumber()
  @IsNotEmpty()
  doctor_id: number;

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
  @IsNumber()
  status: number;

}