import { IsEmail, IsOptional, IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Public User Name cannot be empty' })
  @IsString()
  public_user_name: string;

  @IsOptional()
  @IsString()
  profession: string;

  @IsOptional()
  @IsString()
  specialty: string;

  @IsOptional()
  @IsString()
  emr_use: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  timezone: string;

  @IsNumber()
  status: number;

}