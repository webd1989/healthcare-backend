import { IsNotEmpty, IsOptional, IsString, IsNumber, IsNumberString, Matches, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';


export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0, { message: 'monthly price must be 0 or greater' })
  monthly_price: string;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0, { message: 'monthly price for year must be 0 or greater' })
  monthly_price_for_year: string;

  @IsOptional()
  @IsString()
  sort_description?: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNumber()
  status: number;

}