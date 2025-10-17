import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsOptional()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  user_mobile: string;

  @IsString()
  @IsNotEmpty()
  user_name: string;

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
  doctor_email: string;

  @IsString()
  @IsNotEmpty()
  appointment_date: string;
  
  @IsString()
  @IsNotEmpty()
  appointment_time: string
  

}