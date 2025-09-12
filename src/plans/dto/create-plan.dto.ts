import { IsNotEmpty, IsOptional, IsString, IsNumber, IsNumberString, Matches, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';


export class CreatePlanDto {
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @Matches(/^\d+(\.\d{1,2})?$/, { message: 'monthly_price must be a valid number with up to 2 decimals' })
  monthly_price: string;

  @Matches(/^\d+(\.\d{1,2})?$/, { message: 'monthly_price must be a valid number with up to 2 decimals' })
  monthly_price_for_year: string;

  @IsOptional()
  @IsString()
  sort_description?: string;

  @IsString()
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description?: string;

  @IsString()
  @IsNotEmpty({ message: 'Template cannot be empty' })
  templates: string;

  @IsString()
  @IsNotEmpty({ message: 'Templates description cannot be empty' })
  templates_description: string;

  @IsString()
  @IsNotEmpty({ message: 'Medical dictation cannot be empty' })
  medical_dictation: string;

  @IsString()
  @IsNotEmpty({ message: 'Medical dictation description cannot be empty' })
  medical_dictation_description: string;

  @IsString()
  @IsNotEmpty({ message: 'AI assisted cannot be empty' })
  ai_assisted: string;

  @IsString()
  @IsNotEmpty({ message: 'AI assisted description cannot be empty' })
  ai_assisted_description: string;

  @IsOptional()
  @IsNumber()
  status: number;

}