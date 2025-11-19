import { IsNotEmpty, IsOptional, IsString, IsNumber, IsNumberString } from 'class-validator';

export class CreateMedicineDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumberString()
  @IsNotEmpty()
  price: string;

  @IsOptional()
  @IsString()
  logo?: string;
  
  @IsOptional()
  @IsString()
  unique_code: string;

  @IsOptional()
  @IsNumber()
  status: number;
}