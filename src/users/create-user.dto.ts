import { IsEmail, IsOptional, IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString()
  name: string;

  @IsNumber()
  status: number;
}