import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString, IsBoolean } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsOptional()
  user_id: string;

  @IsString()
  @IsOptional()
  appointment_no: string;
  
  @IsString()
  @IsNotEmpty()
  user_mobile: string;

  @IsString()
  @IsNotEmpty()
  user_first_name: string;

  @IsString()
  @IsNotEmpty()
  user_last_name: string;

  @IsString()
  @IsNotEmpty()
  user_name: string;

  @IsNumber()
  @IsOptional()
  patient_id: string;
  
  @IsNumber()
  @IsOptional()
  template_id: string;

  @IsNumber()
  @IsOptional()
  visit_id: string;  

  @IsString()
  @IsOptional()
  user_email: string;

  @IsString()
  @IsNotEmpty()
  doctor_id: string;

  @IsString()
  @IsOptional()
  doctor_name: string;

  @IsString()
  @IsOptional()
  fields_data: string;
  
  @IsString()
  @IsOptional()
  user_age: string;

  @IsString()
  @IsOptional()
  user_country: string;

  @IsString()
  @IsOptional()
  user_language: string;

  @IsBoolean()
  @IsOptional()
  recently_travelled: boolean;

  @IsBoolean()
  @IsOptional()
  consent: boolean;
  
  @IsString()
  @IsOptional()
  user_gender: string;

  @IsString()
  @IsOptional()
  doctor_email: string;

  @IsString()
  @IsNotEmpty()
  appointment_date: string;
  
  @IsString()
  @IsNotEmpty()
  appointment_time: string
  
  @IsString()
  @IsOptional()
  question_answers: string
  
  @IsString()
  @IsOptional()
  appointment_vitals: string
  
  @IsString()
  @IsOptional()
  previsit_created: string
  
  @IsString()
  @IsOptional()
  postvisit_created: string
  
  @IsString()
  @IsOptional()
  transcribe_status: string
  
  @IsString()
  @IsOptional()
  soap_generated: string
  
  @IsString()
  @IsOptional()
  quick_notes: string
  
  @IsString()
  @IsOptional()
  tasks: string

  @IsString()
  @IsNotEmpty()
  visit_type: string;

  @IsString()
  @IsNotEmpty()
  chief_complaint: string;

}