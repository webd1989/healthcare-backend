import { IsNotEmpty, IsOptional, IsArray, ArrayNotEmpty, IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FormField } from './form-field.dto';

export class CreatePatientformDto {
  @IsNumber()
  @IsNotEmpty()
  doctor_id: number;
  
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  form_field: string;
  
  @IsOptional()
  @IsNumber()
  status: number;
}