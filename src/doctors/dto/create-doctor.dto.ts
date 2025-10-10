import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { Column} from 'typeorm';

export class CreateDoctorDto {

  @IsNumber()
  @IsNotEmpty()
  hospital_id: number;

  @IsOptional()
  @IsString()
  type: string;
  
  @IsOptional()
  @IsString()
  user_code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsString()
  @IsNotEmpty() 
  @Column({ unique: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  mobile: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsNumber()
  status: number;

}