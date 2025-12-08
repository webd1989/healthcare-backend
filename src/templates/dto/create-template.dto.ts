import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateTemplateDto {

  @IsNumber()
  @IsNotEmpty()
  hospital_id: number;

  @IsNumber()
  @IsNotEmpty()
  doctor_id: number;

  @IsString()
  @IsNotEmpty()
  template_name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  speciality: string;
  
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  subjective: string;
  
  @IsString()
  @IsNotEmpty()
  objective: string;

  @IsString()
  @IsNotEmpty()
  assessment: string;

  @IsString()
  @IsOptional()
  plan: string;

  @IsString()
  @IsOptional()
  tags: string;

  @IsString()
  @IsOptional()
  appointment_type: string;

  @IsBoolean()
  @IsOptional()
  is_favorite: boolean;

  @IsOptional()
  @IsNumber()
  status: number;
  


}