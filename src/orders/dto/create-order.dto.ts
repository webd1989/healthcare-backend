import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString, Matches, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';


export class CreateOrderDto {
  
  @IsNumber()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  user_id: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Plan cannot be empty' })
  plan_id: number;

  @IsString()
  @IsNotEmpty({ message: 'Plan type cannot be empty' })
  plan_type: string;

  @IsString()
  @IsOptional()
  user_name: string;

  @IsString()
  @IsOptional()
  user_email: string;

  @IsString()
  @IsOptional()
  monthly_price?: string;

  @IsString()
  @IsOptional()
  grand_total?: string;
  
  @IsString()
  @IsOptional()
  invoice_no?: string;

  @IsString()
  @IsOptional()
  transaction_id?: string;

  @IsNumber()
  @IsOptional()
  templates: string;

  @IsNumber()
  @IsOptional()
  medical_dictation: string;

  @IsNumber()
  @IsOptional()
  ai_assisted: string;

  @IsDateString()
  @IsOptional()
  start_time: string;

  @IsDateString()
  @IsOptional()
  end_time: string;

}