import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreatePatientDto {

  @IsNumber()
  @IsNotEmpty()
  hospital_id: number;

  @IsNumber()
  @IsNotEmpty()
  doctor_id: number;
  
  @IsNumber()
  @IsOptional()
  patient_id: string;

  @IsNumber()
  @IsOptional()
  visit_id: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  mobile: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  age: string;

  @IsBoolean()
  @IsOptional()
  recently_travelled: boolean;

  @IsBoolean()
  @IsOptional()
  consent: boolean;

  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  @IsOptional()
  language: string;

  @IsOptional()
  @IsNumber()
  status: number;
  
  @IsOptional()
  @IsString()
  first_question: string;

}